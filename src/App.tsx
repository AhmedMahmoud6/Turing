import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Tickets from "./pages/Tickets";
import Sponsors from "./pages/Sponsors";
import NotFound from "./pages/NotFound";
import WorkshopRegister from "./pages/WorkshopRegister";
import InnovateXRegister from "./pages/InnovateXRegister";
import InnovateXRules from "./pages/InnovateXRules";
import InnovateXQuiz from "./pages/InnovateXQuiz";
import PaymentMethods from "./pages/PaymentMethods";
import PaymentResult from "./pages/PaymentResult";
import TicketVerify from "./pages/TicketVerify";
import PaymentReview from "./pages/PaymentReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="/register/:id" element={<WorkshopRegister />} /> */}
            {/* <Route path="/innovatex/register" element={<InnovateXRegister />} /> */}
            {/* <Route path="/innovatex/rules" element={<InnovateXRules />} /> */}
            {/* <Route path="/innovatex/quiz" element={<InnovateXQuiz />} /> */}
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/payment/:packageId" element={<PaymentMethods />} />
            <Route path="/admin/payments" element={<PaymentReview />} />
            {/* <Route path="/payment-result" element={<PaymentResult />} /> */}
            <Route path="/ticket-verify" element={<TicketVerify />} />
            {/* <Route path="/sponsors" element={<Sponsors />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
