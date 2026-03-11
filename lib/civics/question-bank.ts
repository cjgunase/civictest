import type { CivicsQuestion } from "@/lib/domain/civics";

export const CIVICS_BANK_VERSION = "2025-mvp-seed-v1";

export const QUESTION_BANK: CivicsQuestion[] = [
  {
    id: "q-001",
    prompt: "What is the supreme law of the land?",
    acceptedAnswers: ["the constitution", "u.s. constitution", "constitution"],
    isDynamicOfficial: false,
  },
  {
    id: "q-002",
    prompt: "What does the Constitution do?",
    acceptedAnswers: [
      "sets up the government",
      "defines the government",
      "protects basic rights of americans",
      "sets up government",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-003",
    prompt: "The idea of self-government is in the first three words of the Constitution. What are these words?",
    acceptedAnswers: ["we the people"],
    isDynamicOfficial: false,
  },
  {
    id: "q-004",
    prompt: "What is an amendment?",
    acceptedAnswers: [
      "a change to the constitution",
      "an addition to the constitution",
      "a correction to the constitution",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-005",
    prompt: "What do we call the first ten amendments to the Constitution?",
    acceptedAnswers: ["the bill of rights"],
    isDynamicOfficial: false,
  },
  {
    id: "q-006",
    prompt: "What is one right or freedom from the First Amendment?",
    acceptedAnswers: [
      "speech",
      "religion",
      "assembly",
      "press",
      "petition the government",
      "freedom of speech",
      "freedom of religion",
      "freedom of assembly",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-007",
    prompt: "How many amendments does the Constitution have?",
    acceptedAnswers: ["27", "twenty seven", "twenty-seven"],
    isDynamicOfficial: false,
  },
  {
    id: "q-008",
    prompt: "What did the Declaration of Independence do?",
    acceptedAnswers: [
      "announced our independence from great britain",
      "declared our independence from great britain",
      "said that the united states is free",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-009",
    prompt: "What are two rights in the Declaration of Independence?",
    acceptedAnswers: [
      "life and liberty",
      "liberty and the pursuit of happiness",
      "life liberty and the pursuit of happiness",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-010",
    prompt: "What is freedom of religion?",
    acceptedAnswers: [
      "you can practice any religion",
      "you can practice any religion or not practice a religion",
      "you can choose your religion",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-011",
    prompt: "What is the economic system in the United States?",
    acceptedAnswers: ["capitalist economy", "market economy", "capitalism"],
    isDynamicOfficial: false,
  },
  {
    id: "q-012",
    prompt: "What is the rule of law?",
    acceptedAnswers: [
      "everyone must follow the law",
      "leaders must obey the law",
      "government must obey the law",
      "no one is above the law",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-013",
    prompt: "Name one branch or part of the government.",
    acceptedAnswers: [
      "congress",
      "legislative",
      "president",
      "executive",
      "the courts",
      "judicial",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-014",
    prompt: "What stops one branch of government from becoming too powerful?",
    acceptedAnswers: [
      "checks and balances",
      "separation of powers",
      "the constitution",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-015",
    prompt: "Who is in charge of the executive branch?",
    acceptedAnswers: ["the president"],
    isDynamicOfficial: false,
  },
  {
    id: "q-016",
    prompt: "Who makes federal laws?",
    acceptedAnswers: ["congress", "senate and house", "legislature"],
    isDynamicOfficial: false,
  },
  {
    id: "q-017",
    prompt: "What are the two parts of the U.S. Congress?",
    acceptedAnswers: ["the senate and house", "senate and house of representatives"],
    isDynamicOfficial: false,
  },
  {
    id: "q-018",
    prompt: "How many U.S. Senators are there?",
    acceptedAnswers: ["100", "one hundred"],
    isDynamicOfficial: false,
  },
  {
    id: "q-019",
    prompt: "We elect a U.S. Senator for how many years?",
    acceptedAnswers: ["6", "six"],
    isDynamicOfficial: false,
  },
  {
    id: "q-020",
    prompt: "The House of Representatives has how many voting members?",
    acceptedAnswers: ["435", "four hundred thirty five"],
    isDynamicOfficial: false,
  },
  {
    id: "q-021",
    prompt: "We elect a U.S. Representative for how many years?",
    acceptedAnswers: ["2", "two"],
    isDynamicOfficial: false,
  },
  {
    id: "q-022",
    prompt: "What is one responsibility that is only for United States citizens?",
    acceptedAnswers: ["serve on a jury", "vote in a federal election", "voting"],
    isDynamicOfficial: false,
  },
  {
    id: "q-023",
    prompt: "Name one right only for United States citizens.",
    acceptedAnswers: ["vote in a federal election", "run for federal office", "vote"],
    isDynamicOfficial: false,
  },
  {
    id: "q-024",
    prompt: "What are two rights of everyone living in the United States?",
    acceptedAnswers: [
      "freedom of expression and freedom of speech",
      "freedom of speech and freedom of religion",
      "freedom of speech and the right to petition",
    ],
    isDynamicOfficial: false,
  },
  {
    id: "q-025",
    prompt: "Who is the current President of the United States?",
    acceptedAnswers: [],
    isDynamicOfficial: true,
    dynamicType: "PRESIDENT",
  },
];

export function getQuestionCountTarget(): number {
  return 128;
}
