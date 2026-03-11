import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "lib", "civics", "question-explanations.ts");
let content = fs.readFileSync(filePath, "utf-8");
content = content.replace(/&#128DCDC;/g, "📜");
fs.writeFileSync(filePath, content);
console.log("Fixed emojis");
