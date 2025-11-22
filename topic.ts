import * as cheerio from "cheerio";
import chalk from "chalk";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const limit = 4;
const beginning = 1467-1;


async function download(file, core, i, type) {
    const linkElm = file.lastChild;
    const linkName: string = linkElm.children[0].children[0].data;
    if (linkName === `${core} INDEX`) return;

    const link = linkElm.attribs.href;
    let topic = null;

    if (type===1) {
        topic = linkName.split("-")[0].split(core)[1].slice(0, -1).replace("&", "and");
        if (topic.includes(" ")) {
            const split = topic.split(" ");
            if (split.pop()?.length === 1) {
                topic = split.join(" ");
            }
        }
        if (i===2) topic = topic.substring(2); else topic = topic.substring(1);
    } else {
        topic = linkName.split(" ").slice(1).join(" ");
    }
    if (topic==="Trigonomnetry") topic = "Trigonometry";
    if (topic==="Expodentials & Logarithms") topic = "Exponentials & Logarithms"

    const fileRes = await fetch(link);

    const path = `Maths/Topics From IAL/Set ${type}/${topic}/${core}/${linkName}.pdf`
    await Bun.write(path, fileRes);

    console.log(`${chalk.magenta.bold("IAL Topics Questions")} - ${chalk.green.bold("Successfully Downloaded")}: ${linkName}`);
}

export async function downloadIALTopics() {
    console.log(chalk.cyan.bold("Downloading IAL Topic Questions"));

    for (let i = 1; i <= limit; i++) {
        const core = `C${i}`;
        const topicNumber = beginning+i;
        const url = `https://www.physicsandmathstutor.com/a-level-maths-papers/c${i}-by-topic/`;

        const res = await fetch(url);
        const body = await res.text();
        const $ = cheerio.load(body);

        $(`#post-${topicNumber} > div.post-entry > div.one_half > ul:nth-child(4)`).children().each(async (j, file) => {
            await download(file, core, i, 1);
        });

        $(`#post-${topicNumber} > div.post-entry > div.one_half > ul:nth-child(7)`).children().each(async (j, file) => {
            await download(file, core, i, 2);
        });
    }
}