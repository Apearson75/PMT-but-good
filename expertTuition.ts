import * as cheerio from "cheerio";
import chalk from "chalk";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const sections = ["pure", "statistics", "mechanics"];

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

export async function downloadExpertTuition() {
    console.log(chalk.cyan.bold("Downloading Expert Tuition Questions"));

    sections.forEach(async (section) => {
        await Bun.$`mkdir -p "Maths/Expert Tuition/${section.capitalize()}"`;
        const url = `https://expert-tuition.co.uk/past-papers/edexcel-a-level-mathematics-${section}-questions-by-topic/`;

        const res = await fetch(url);
        const body = await res.text();
        const $ = cheerio.load(body);

        await Promise.all(
            $(".download-btn").children().each(async (j, file) => {
                const link: string = file.parent.attribs.href;
                if (link === "") return;

                let fileName = link.split("/").at(-1).replace(".pdf", "");

                if (!fileName.includes("MS")) {
                    fileName = fileName.replaceAll("-", " ") + " - Questions";
                } else {
                    fileName = fileName.replace("MS", "").replaceAll("-", " ") + "- Answers"
                }

                if (fileName === "Statistical Distributions  1- Answers") fileName = "Statistical Distributions - Answers"
                
                const path = `Maths/Expert Tuition/${section.capitalize()}/${fileName}.pdf`;

                await Bun.$`curl -L ${link} -o "${path}" -s`;

                console.log(`${chalk.magenta.bold("Expert Tuition Questions")} - ${chalk.green.bold("Successfully Downloaded")}: ${fileName}`);

                await sleep(500);
            })
        );
    })
}