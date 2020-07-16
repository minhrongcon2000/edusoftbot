const Discord = require("discord.js");
const client = new Discord.Client();
const load_score = require("./load_data");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const isBlank = (str) => !str || /^\s*$/.test(str);

client.on("ready", () => {
  // initialize log file
  if (!fs.existsSync("logging.log"))
    fs.writeFileSync("logging.log", `Connected as ${client.user.tag}\n`);

  /**
   * Uncomment the followng line to get id of channel
   */

  // client.channels.cache.forEach((channel) =>
  //   console.log(`${channel.id} ${channel.name} ${channel.type}`)
  // );

  /**
   * get channel by its id
   */
  const generalChannel = client.channels.cache.get(
    process.env.ANNOUCEMENT_CHANNEL
  );

  load_score(process.env.USERNAME, process.env.PASSWORD)
    .then((scores) => {
      const pathname = "score.json";

      // if there is no score.json, then create it and notify the user as score initialized
      // and notify all the subject that has at least one non-null score attribute.
      if (!fs.existsSync(pathname)) {
        generalChannel.send("Score initialized: ");
        for (const subject_name in scores) {
          if (
            !isBlank(scores[subject_name].attendance_score) ||
            !isBlank(scores[subject_name].midterm_score) ||
            !isBlank(scores[subject_name].final_score) ||
            !isBlank(scores[subject_name].overall)
          ) {
            let reply = "";
            reply += `-${subject_name}:\n`;
            reply += `\t-Attendance Score: ${scores[subject_name].attendance_score} (${scores[subject_name].attendance_percent}\%)\n`;
            reply += `\t-Midterm Score: ${scores[subject_name].midterm_score} (${scores[subject_name].midterm_percent}\%)\n`;
            reply += `\t-Final Score: ${scores[subject_name].final_score} (${scores[subject_name].final_percent}\%)\n`;
            reply += `\t-Overall Score: ${scores[subject_name].overall}\n`;
            reply += "\n";
            generalChannel.send(reply);
          }
        }
      } else {
        const record = JSON.parse(fs.readFileSync(pathname));
        let add_scores = [];
        let update_score = [];

        // loops through all the subject name of the recent-loaded score
        // if the subject name is new, the relevant value of the subject name in the record is undefined.
        // if the subject name exists but it has been updated,
        // the string representations of relevant value of the subject name in the recent-loaded score and record are different
        for (const subject_name in scores) {
          if (!record[subject_name]) {
            add_scores.push(subject_name);
          } else {
            if (
              JSON.stringify(record[subject_name]) !==
              JSON.stringify(scores[subject_name])
            ) {
              update_score.push({
                subject_name,
                ...scores[subject_name],
              });
            }
          }
        }

        // notify the added subject (if any)
        if (add_scores.length !== 0) {
          let reply = "Score added:\n";
          for (const score of add_scores) {
            reply += `-${score}\n`;
          }
          reply += "\n";
          generalChannel.send(reply);
        }

        // notify the updated score (if any)
        if (update_score.length !== 0) {
          generalChannel.send("Score updated:");

          for (const score of update_score) {
            let reply = "";
            reply += `-${score.subject_name}\n`;
            reply += `\t-Attendance Score: ${score.attendance_score} (${score.attendance_percent}\%)\n`;
            reply += `\t-Midterm Score: ${score.midterm_score} (${score.midterm_percent}\%)\n`;
            reply += `\t-Final Score: ${score.final_score} (${score.final_percent}\%)\n`;
            reply += `\t-Overall Score: ${score.overall}\n`;
            reply += "\n";
            generalChannel.send(reply);
          }
        }
      }

      // save the new score
      fs.writeFileSync(pathname, JSON.stringify(scores, null, 2));
    })
    .catch((err) => {
      let logging = fs.readFileSync("logging.log");
      logging += `[${Date.now()}] ${err}\n`;
      fs.writeFileSync("logging.log", logging);
    });

  // this code below is defined for the purpose of checking score for every 15 minutes
  // load period is calculated in milliseconds
  const loadPeriod = 15 * 60 * 1000;

  // setInterval takes in two argument, one is a desired function (this function takes in no argument, and return None),
  // and the other is a period after which the function will be executed
  setInterval(
    () =>
      load_score(process.env.USERNAME, process.env.PASSWORD)
        .then((scores) => {
          const pathname = "score.json";
          if (!fs.existsSync(pathname)) {
            generalChannel.send("Score initialized: ");
            for (const subject_name in scores) {
              if (
                !isBlank(scores[subject_name].attendance_score) ||
                !isBlank(scores[subject_name].midterm_score) ||
                !isBlank(scores[subject_name].final_score) ||
                !isBlank(scores[subject_name].overall)
              ) {
                let reply = "";
                reply += `-${subject_name}:\n`;
                reply += `\t-Attendance Score: ${scores[subject_name].attendance_score} (${scores[subject_name].attendance_percent}\%)\n`;
                reply += `\t-Midterm Score: ${scores[subject_name].midterm_score} (${scores[subject_name].midterm_percent}\%)\n`;
                reply += `\t-Final Score: ${scores[subject_name].final_score} (${scores[subject_name].final_percent}\%)\n`;
                reply += `\t-Overall Score: ${scores[subject_name].overall}\n`;
                reply += "\n";
                generalChannel.send(reply);
              }
            }
          } else {
            const record = JSON.parse(fs.readFileSync(pathname));
            let add_scores = [];
            let update_score = [];
            for (const subject_name in scores) {
              if (!record[subject_name]) {
                add_scores.push(subject_name);
              } else {
                if (
                  JSON.stringify(record[subject_name]) !==
                  JSON.stringify(scores[subject_name])
                ) {
                  update_score.push({
                    subject_name,
                    ...scores[subject_name],
                  });
                }
              }
            }
            if (add_scores.length !== 0) {
              let reply = "Score added:\n";
              for (const score of add_scores) {
                reply += `-${score}\n`;
              }
              reply += "\n";
              generalChannel.send(reply);
            }

            if (update_score.length !== 0) {
              generalChannel.send("Score updated:");

              for (const score of update_score) {
                let reply = "";
                reply += `-${score.subject_name}\n`;
                reply += `\t-Attendance Score: ${score.attendance_score} (${score.attendance_percent}\%)\n`;
                reply += `\t-Midterm Score: ${score.midterm_score} (${score.midterm_percent}\%)\n`;
                reply += `\t-Final Score: ${score.final_score} (${score.final_percent}\%)\n`;
                reply += `\t-Overall Score: ${score.overall}\n`;
                reply += "\n";
                generalChannel.send(reply);
              }
            }
          }
          fs.writeFileSync(pathname, JSON.stringify(scores, null, 2));
        })
        .catch((err) => {
          let logging = fs.readFileSync("logging.log");
          logging += `[${Date.now()}] ${err}\n`;
          fs.writeFileSync("logging.log", logging);
        }),
    loadPeriod
  );
});

client.login(process.env.TOKEN);
