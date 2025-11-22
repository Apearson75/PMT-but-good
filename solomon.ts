import chalk from "chalk";
import * as cheerio from "cheerio";
import { rm } from "node:fs/promises";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const limit = 4;
// https://www.physicsandmathstutor.com/maths-revision/a-level-core-2/solomon-worksheets/

// await rm("solomon", { recursive: true });

export async function downloadSolomon() {
    console.log(chalk.cyan.bold("Downloading Solomon Papers"));

    for (let i = 1; i <= limit; i++) {
        const core = `C${i}`;
        const url = `https://www.physicsandmathstutor.com/maths-revision/a-level-core-${i}/solomon-worksheets/`;

        const res = await fetch(url);
        const body = await res.text();
        const $ = cheerio.load(body);

        $('.files').children().each(async (j, file) => {
            const linkElm = file.lastChild;
            const linkName: string = linkElm.children[0].children[0].data;
            if (linkName === `${core} INDEX`) return;

            const link = linkElm.attribs.href;
            
            // Random BS I thought of can't lie
            let topic = linkName.split("-")[0].split(core)[1].slice(0, -1).replace("&", "and");
            if (topic.includes(" ")) {
                const split = topic.split(" ");
                if (split.pop()?.length === 1) {
                    topic = split.join(" ");
                }
            }
            topic = topic.substring(1);

            if (topic === "Differentialtion") topic = "Differentiation";

            const fileRes = await fetch(link);

            await Bun.write(`Maths/Solomon Papers/${topic}/${core}/${linkName}.pdf`, fileRes);

            const path = `Maths/Solomon Papers/${topic}/${core}/${linkName}.pdf`;

            console.log(`${chalk.magenta.bold("Solomon Paper")} - ${chalk.green.bold("Successfully Downloaded")}: ${linkName}`);
        })
    }
}