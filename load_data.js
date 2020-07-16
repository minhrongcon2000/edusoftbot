const puppeteer = require("puppeteer");
const fs = require("fs");

module.exports = (username, password) => {
  return new Promise(async (resolve, reject) => {
    let logging = fs.readFileSync("logging.log");

    // open chrominum
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://edusoftweb.hcmiu.edu.vn");

    // login into edusoftweb
    logging += `[${Date.now()}] Login to school website...\n`;
    await page.type(
      "#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa",
      username
    );
    await page.type(
      "#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau",
      password
    );
    await page.click("#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap");

    // check whether login successful
    try {
      await page.waitFor("#ctl00_menu_lblXemDiem");
      await page.click("#ctl00_menu_lblXemDiem");
      await page.waitFor("#ctl00_ContentPlaceHolder1_ctl00_lnkChangeview2");
    } catch (err) {
      reject("Information incorrected!");
      await browser.close();
      return;
    }

    // click "Xem tất cả điểm"
    await page.click("#ctl00_ContentPlaceHolder1_ctl00_lnkChangeview2");

    // this period of time is set based on the network connection, it can be improved.
    await page.waitFor(15000);

    // get all the scores in the form of element handling object
    const events = await page.$$(".row-diem");
    const scores = {};

    // format score output
    // score should be a hashmap with key subject name, and value a hashmap that contains id, credit, and scores
    logging += `[${Date.now()}] Get scores...\n`;
    for (const event of events) {
      const subject_id = await event.evaluate(
        (node) => node.children[1].children[0].innerText
      );
      const subject_name = await event.evaluate(
        (node) => node.children[2].children[0].innerText
      );
      const credit = await event.evaluate(
        (node) => node.children[3].children[0].innerText
      );
      const attendance_percent = await event.evaluate(
        (node) => node.children[4].children[0].innerText
      );
      const midterm_percent = await event.evaluate(
        (node) => node.children[5].children[0].innerText
      );
      const final_percent = await event.evaluate(
        (node) => node.children[6].children[0].innerText
      );
      const attendance_score = await event.evaluate(
        (node) => node.children[7].children[0].innerText
      );
      const midterm_score = await event.evaluate(
        (node) => node.children[8].children[0].innerText
      );
      const final_score = await event.evaluate(
        (node) => node.children[9].children[0].innerText
      );
      const overall = await event.evaluate(
        (node) => node.children[10].children[0].innerText
      );
      if (subject_id !== "")
        scores[subject_name] = {
          subject_id,
          credit,
          attendance_percent,
          midterm_percent,
          final_percent,
          attendance_score,
          midterm_score,
          final_score,
          overall,
        };
    }

    logging += `[${Date.now()}] Get scores completed!\n`;
    await browser.close();
    fs.writeFileSync("logging.log", logging);
    resolve(scores);
  });
};
