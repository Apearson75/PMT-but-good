import { sleep } from "bun";
import { downloadSolomon } from "./solomon";
import { downloadIALTopics } from "./topic";
import chalk from "chalk";

const pythonFileURL = "https://gist.githubusercontent.com/Apearson75/f4bef10a772bdd51de74a974c92c1400/raw/randomPaper.py";


await downloadSolomon();
await downloadIALTopics();

await sleep(3000);

console.log(chalk.red.bold("NOTE that IAL Set 2 doesn't have a mark scheme"))
console.log("All Done!!!!\nProgram will now end :)");

const randomFilePython = await fetch(pythonFileURL);

await Bun.write("Maths/randomPaper.py", randomFilePython);

await sleep(2000);