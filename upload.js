const obj = {
    course_major: "INFO",
    course_number: "340",
    course_title: "Web Development",
    professor: "Doe",
    quarter: "Fall",
};
const json = JSON.stringify(obj);

const blob = new Blob([json], {
    type: "application/json",
});

const get_pdf = await fetch("test.pdf");
const pdf_blob = await get_pdf.blob();

const data = new FormData();

data.append("document", blob);
data.append("pdf", pdf_blob);

const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: data,
});

console.log(await response.text());

export {};
