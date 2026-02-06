import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  getCompetitionQuestions,
  saveQuizSubmission,
  getRegistrationById,
  markQuizStarted,
  hasQuizSubmissionForEmail,
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

type Question = {
  id: string;
  question: string;
  choices: string[];
};

export default function InnovateXQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // registrationId must be passed via navigation state or localStorage to prevent direct URL access
  const regId =
    ((location.state as any)?.regId as string | undefined) ||
    (() => {
      try {
        return localStorage.getItem("innovatex_regId") ?? undefined;
      } catch (e) {
        return undefined;
      }
    })();

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const answersRef = React.useRef<Record<string, string>>(answers);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(10 * 60); // default 10 minutes
  const [loading, setLoading] = React.useState(true);
  const [finished, setFinished] = React.useState(false);
  const [switchedTabs, setSwitchedTabs] = React.useState(false);
  const questionsRef = React.useRef<Question[]>(questions);
  const switchedTabsRef = React.useRef<boolean>(switchedTabs);
  const altPressedRef = React.useRef<boolean>(false);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const buildFinalAnswers = (
    currentAnswers: Record<string, string>,
    qs: Question[],
  ): Record<string, string> => {
    const out: Record<string, string> = {};
    qs.forEach((qq, idx) => {
      const ans =
        typeof currentAnswers[qq.id] === "string" &&
        currentAnswers[qq.id].length > 0
          ? currentAnswers[qq.id]
          : "not solved";
      out[`question ${idx + 1}`] = ans;
    });
    return out;
  };

  React.useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  React.useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  React.useEffect(() => {
    switchedTabsRef.current = switchedTabs;
  }, [switchedTabs]);

  // Ensure we have questions, normalize answers and persist submission
  const saveAnswersAndFinish = async (secLeft: number, switched = false) => {
    if (!regId) return;
    try {
      let qs = questionsRef.current;
      if (!qs || qs.length === 0) {
        qs = (await getCompetitionQuestions()) as Question[];
        setQuestions(qs);
        questionsRef.current = qs;
      }
      const finalAnswers = buildFinalAnswers(
        answersRef.current,
        qs as Question[],
      );
      await saveQuizSubmission(regId, finalAnswers, formatTime(secLeft), {
        switchedTabs: switched,
      });
    } catch (e) {
      console.error("Failed to save quiz (finish/timeout)", e);
    } finally {
      try {
        localStorage.removeItem("innovatex_regId");
      } catch (e) {}
    }
  };

  const allAnswered =
    questions.length > 0 &&
    questions.every(
      (q) => typeof answers[q.id] === "string" && answers[q.id].length > 0,
    );

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      if (!regId) {
        // user didn't come through the proper flow — redirect to rules
        navigate("/innovatex/rules", { replace: true });
        return;
      }

      try {
        // load registration and check one-time-per-email
        const reg = await getRegistrationById(regId);
        if (!reg) {
          toast({ title: "Error", description: "Registration not found" });
          navigate("/innovatex/rules", { replace: true });
          return;
        }

        if (reg.quizSubmitted) {
          toast({
            title: "Notice",
            description: "Quiz already submitted for this registration.",
          });
          navigate("/innovatex/rules", { replace: true });
          return;
        }

        if (reg.email) {
          const exists = await hasQuizSubmissionForEmail(reg.email, regId);
          if (exists) {
            toast({
              title: "Notice",
              description: "A quiz has already been submitted for this email.",
            });
            navigate("/innovatex/rules", { replace: true });
            return;
          }
        }

        // mark start if not already marked
        const started = reg.quizStartedAt ?? (await markQuizStarted(regId));

        // compute seconds left based on started timestamp
        let total = 10 * 60; // default 10 minutes
        const urlParams = new URLSearchParams(location.search);
        const tparam = urlParams.get("t");
        if (tparam) {
          const v = Number(tparam);
          if (!Number.isNaN(v) && v > 0) total = v;
        }

        if (started) {
          const startDate = (started as any).toDate
            ? (started as any).toDate()
            : new Date(started);
          const elapsed = Math.floor((Date.now() - startDate.getTime()) / 1000);
          const remaining = Math.max(0, total - elapsed);
          setSecondsLeft(remaining);
          if (remaining <= 0) {
            // timeout immediately: ensure saving normalized answers then exit
            try {
              await saveAnswersAndFinish(0, false);
            } catch (e) {
              console.error("Failed to save timed-out quiz", e);
            }
            toast({
              title: "Time's up",
              description: "Quiz time expired — answers saved for review.",
            });
            navigate("/", { replace: true });
            return;
          }
        }

        const q = await getCompetitionQuestions();
        if (!mounted) return;
        setQuestions(q as Question[]);
      } catch (e) {
        console.error("Failed to init quiz", e);
        toast({ title: "Error", description: "Failed to initialize quiz" });
        navigate("/innovatex/rules", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [regId]);

  React.useEffect(() => {
    if (finished) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          // time expired
          handleTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // detect tab switch / blur
    const onVisibility = () => {
      if (document.hidden) {
        switchedTabsRef.current = true;
        setSwitchedTabs(true);
      }
    };
    const onBlur = () => {
      // mark switched on any blur (existing behavior)
      switchedTabsRef.current = true;
      setSwitchedTabs(true);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt") altPressedRef.current = true;
      // capture Alt+Tab combinations when possible
      if (e.key === "Tab" && (e as any).altKey) {
        switchedTabsRef.current = true;
        setSwitchedTabs(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") altPressedRef.current = false;
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [finished]);

  const handleTimeout = async () => {
    setFinished(true);
    toast({
      title: "Time's up",
      description: "Quiz time expired — answers saved for review.",
    });
    if (regId) {
      try {
        await saveAnswersAndFinish(0, switchedTabsRef.current);
      } catch (e) {
        console.error("Failed to save quiz submission", e);
      }
    }
    try {
      localStorage.removeItem("innovatex_regId");
    } catch (e) {}
    setTimeout(() => navigate("/"), 3000);
  };

  const handleSelect = (qId: string, choiceIndex: number) => {
    const choice =
      questions.find((qq) => qq.id === qId)?.choices[choiceIndex] ??
      String(choiceIndex);
    setAnswers((a) => {
      const next = { ...a, [qId]: choice };
      answersRef.current = next;
      return next;
    });
  };

  const handleNext = async () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }

    // finish quiz: save answers for manual review (do not auto-accept)
    setFinished(true);
    toast({
      title: "Submitting",
      description: "Saving quiz answers for review...",
    });
    if (regId) {
      try {
        await saveAnswersAndFinish(secondsLeft, switchedTabsRef.current);
        toast({
          title: "Saved",
          description: "Answers saved — pending review.",
        });
      } catch (e) {
        console.error("Failed to submit quiz", e);
        toast({ title: "Error", description: "Failed to save quiz answers." });
      }
    }

    try {
      localStorage.removeItem("innovatex_regId");
    } catch (e) {}
    setTimeout(() => navigate("/"), 1500);
  };

  const handleBack = () => {
    if (index > 0) setIndex((i) => i - 1);
    else navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <Header />
        <div className="py-24 container mx-auto px-4">Loading quiz...</div>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <Header />
        <div className="py-24 container mx-auto px-4">No quiz available.</div>
        <Footer />
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <div className="py-12 container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">InnovateX Quiz</h2>
          <div className="text-sm font-mono">
            Time left: {formatTime(secondsLeft)}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <div className="mb-4">
            <div className="text-sm text-muted-foreground">
              Question {index + 1} of {questions.length}
            </div>
            <h3 className="font-semibold text-lg mt-2">{q.question}</h3>
          </div>

          <div className="space-y-3">
            {q.choices.map((c, i) => (
              <label
                key={i}
                className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-accent/5"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === c}
                  onChange={() => handleSelect(q.id, i)}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            {index > 0 ? (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-3">
              <Button
                onClick={handleNext}
                disabled={
                  finished ||
                  // if last question require allAnswered, else require current answered
                  (index === questions.length - 1
                    ? !allAnswered
                    : !(
                        typeof answers[q.id] === "string" &&
                        answers[q.id].length > 0
                      ))
                }
              >
                {index < questions.length - 1 ? "Next" : "Finish"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
