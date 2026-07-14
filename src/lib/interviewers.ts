export interface Interviewer {
  name: string;
  title: string;
  gender: "male" | "female";
  image: string;
}

// The interviewer roster — one of these is picked at case-generation time and
// rides along in the session's caseData, so the live call, voice mode, and text
// mode all show the same person (same face, same name, same TTS voice) for a
// given case. Names follow each sprite's color/look.
export const INTERVIEWERS: Interviewer[] = [
  { name: "Blake", title: "Senior Engagement Manager", gender: "male", image: "/interviewers/business-blue-front.png" },
  { name: "Sonny", title: "Engagement Manager", gender: "male", image: "/interviewers/business-butter-front.png" },
  { name: "Preston", title: "Associate Partner", gender: "male", image: "/interviewers/business-peach-front.png" },
  { name: "Basil", title: "Principal", gender: "male", image: "/interviewers/business-sage-front.png" },
  { name: "Skyler", title: "Senior Consultant", gender: "male", image: "/interviewers/business-sky-front.png" },
  { name: "Cora", title: "Senior Engagement Manager", gender: "female", image: "/interviewers/business-coral-front.png" },
  { name: "Violet", title: "Associate Partner", gender: "female", image: "/interviewers/business-lavender-front.png" },
  { name: "Ivy", title: "Engagement Manager", gender: "female", image: "/interviewers/business-mint-front.png" },
  { name: "Rosie", title: "Principal", gender: "female", image: "/interviewers/business-pink-front.png" },
  { name: "Clementine", title: "Senior Consultant", gender: "female", image: "/interviewers/business-terracotta-front.png" },
];

export function pickRandomInterviewer(): Interviewer {
  return INTERVIEWERS[Math.floor(Math.random() * INTERVIEWERS.length)];
}
