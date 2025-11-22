import * as cherrio from "cheerio";



const data = {}

async function getNotesLinks(url: string) {
    const urlPath = URL.parse(url).pathname.split("/");
    const subject = urlPath[1];
    const topic = urlPath[2];
    const res = await fetch(url);
    const text = await res.text();
    const $ = cherrio.load(text);

    console.log(subject)
    
    if (!data[subject]) data[subject] = {};
    if (!data[subject][topic]) data[subject][topic] = {};

    data[subject][topic]["sections"] = {};

    $('.post-entry ul').children().each((i, el) => {
        const div = $(el).parent().parent();
        const heading = div.children()[0].name;
        if (heading[0] === "h") {
            console.log($(div).text())
        }
    })

    $('.one_half').children().each((i, el) => {
        const name = el.name;

        if (name[0] === "h") {
            console.log(`Header: ${$(el).text()}`)
        } else if (name === "div") {
            const sectionDiv = $(el).children();

            if (sectionDiv[0].name !== "strong") return;

            const title = $(sectionDiv[0]);
            const list = $(sectionDiv[1]);
            console.log(title.text())

            list.children().each((k, li) => {
                if (li.name !== "li") return;
                const link = $($(li).children()[0])
                const url = link.attr('href');
                const linkTitle = link.text();

                console.log(`- ${linkTitle} - ${url}`)
            })
        }
    })
}

getNotesLinks("https://www.physicsandmathstutor.com/computer-science-revision/a-level-ocr/data-types-structures-algorithms-as")
getNotesLinks("https://www.physicsandmathstutor.com/physics-revision/a-level-ocr-a/module-1/")