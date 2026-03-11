import fs from 'fs';

let content = fs.readFileSync('/Users/gunaseka/projects/civictest/components/InterviewSimulator.tsx', 'utf-8');

// Replace the startNewSession useEffect hook
content = content.replace(
`    useEffect(() => {
        startNewSession();
    }, [startNewSession]);`,
`    // Removed auto-start, now triggered by button in overview phase
`
);

// update phase state
content = content.replace(
`const [phase, setPhase] = useState<"loading" | "intro" | "interview" | "done">("loading");`,
`const [phase, setPhase] = useState<"overview" | "loading" | "intro" | "interview" | "done">("overview");`
);

fs.writeFileSync('/Users/gunaseka/projects/civictest/components/InterviewSimulator.tsx', content);
