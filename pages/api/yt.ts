import ytdl from "ytdl-core";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

import { Form } from "../";

export default async function handler(
  { body }: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { yt, filename }: Form = body;

    if (!fs.existsSync("./downloads")) {
      fs.mkdirSync("./downloads");
    }

    if (!ytdl.validateURL(yt)) {
      return res.status(404).send("Video not found");
    }

    const file = `./downloads/${filename}.mp3`;

    if (!!fs.existsSync(file)) {
      return res.status(409).send("File already exists");
    }

    ytdl(yt, { filter: "audioonly" }).pipe(fs.createWriteStream(file));

    setTimeout(() => {
      if (!fs.existsSync(file)) {
        return res.status(400).send("Something went wrong");
      } else {
        res.status(200).send("File saved");
      }
    }, 0);
  } catch (error) {}
}
