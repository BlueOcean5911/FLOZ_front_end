import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface ApiRequest extends NextApiRequest {
  body: ENDPOINT_NAMEApiRequest;
}

const ENDPOINT_NAME = async (
  req: ApiRequest,
  res: NextApiResponse<ENDPOINT_NAMEApiResponse | { error: string }>
) => {
  console.log("---ENDPOINT_NAME---");

  try {
    return res.status(200).json("Success!");
  } catch (err) {
    const error = JSON.stringify(err);
    console.log(err);
    return res.status(500).json({ error });
  }
};

export default ENDPOINT_NAME;
