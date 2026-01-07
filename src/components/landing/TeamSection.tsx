import { Facebook, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Ali Ahmed",
    role: "Founder",
    image: "/Ali Ahmed.jpg",
    facebook: "https://www.facebook.com/ali.ahmed.805895",
    linkedin: "https://www.linkedin.com/in/ali-ahmed-sayed/",
  },
  {
    name: "Eslam Emam",
    role: "Chairman",
    image: "/Eslam-Emam.jpg",
    facebook: "https://www.facebook.com/SOLOM777",
    linkedin: "https://www.linkedin.com/in/eslam-emam-hussien/",
  },
  {
    name: "Ahmed Zaki",
    role: "Tech Lead",
    image: "/Ahmed Zaki.jpg",
    facebook: "https://www.facebook.com/ahmed.mahmoud.570618",
    linkedin: "https://www.linkedin.com/in/ahmed-mahmoud-zaki/",
  },
  {
    name: "Ola Rabie",
    role: "Head PR",
    image: "/ola.png",
    facebook: "https://www.facebook.com/olalolo52004",
  },
  {
    name: "Tabark Moukhtar",
    role: "Admin Lead",
    image: "/tabark.jpg",
    facebook: "https://www.facebook.com/tabark.moukthar",
    linkedin: "https://www.linkedin.com/in/tabark-moukhtar/",
  },
  // {
  //   name: "Badry",
  //   role: "OC Manager",
  //   image: "/badry.jfif",
  // },
];

export function TeamSection() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
            Team
          </span>
          <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
            The <span className="text-primary">Organizers</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Meet the passionate team behind TEDxITechSchoolYouth.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="group text-center">
              {/* Avatar Placeholder */}
              <div className="w-32 h-32 rounded-full bg-muted border-2 border-border group-hover:border-primary mx-auto mb-6 flex items-center justify-center transition-colors duration-300 overflow-hidden">
                <img src={member.image} alt="Organizer Photo" />
              </div>

              {/* Info */}
              <h3 className="font-heading text-lg font-bold mb-1">
                {member.name}
              </h3>
              <p className="text-primary font-heading text-sm font-medium uppercase tracking-wider mb-3">
                {member.role}
              </p>

              <div className="flex items-center justify-center gap-3">
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} LinkedIn`}
                    className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                ) : (
                  ""
                )}
                {member.facebook ? (
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} Facebook`}
                    className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
