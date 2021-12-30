import grpc from "k6/net/grpc";
import { check, sleep } from "k6";
const client = new grpc.Client();
client.load(["definitions"], "../../proto/conversation.proto");

export const options = {
  thresholds: {
    http_req_duration: ["p(99)<2000"],
  },
  stages: [
    { duration: "10s", target: "1" },
    { duration: "5s", target: "50" },
    { duration: "10s", target: "100" },
    { duration: "10s", target: "500" },
    { duration: "20s", target: "500" },
    { duration: "5s", target: "1000" },
    { duration: "10s", target: "1000" },
    { duration: "10s", target: "500" },
    { duration: "20s", target: "500" },
    { duration: "10s", target: "100" },
    { duration: "10s", target: "50" },
    { duration: "5s", target: "1" },
  ],
};

export default function () {
  client.connect("127.0.0.1:50051", {
    plaintext: true,
    timeout: 5000,
  });

  const data = { message: `message from ${__VU}` };
  const response = client.invoke("conversation.Conversation/SayHi", data);
  check(response, {
    "status is OK": (r) => r && r.status == grpc.StatusOK,
  });

  const Talkresponse = client.invoke("conversation.Conversation/Talk", data);
  check(Talkresponse, {
    "status is OK": (r) => r && r.status == grpc.StatusOK,
  });

  const SayGoodbyeResponse = client.invoke(
    "conversation.Conversation/SayGoodbye",
    data
  );
  check(SayGoodbyeResponse, {
    "status is OK": (r) => r && r.status == grpc.StatusOK,
  });

  client.close();
  sleep(1);
}
