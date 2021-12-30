import * as grpc from "@grpc/grpc-js";
import { load } from "@grpc/proto-loader";
import path from "path";

const main = async () => {
  const protoFilePath = path.resolve("proto", "conversation.proto");

  // Load the file and get the package definition
  const packageDefinition = await load(protoFilePath, {});
  const grpcPackage = grpc.loadPackageDefinition(packageDefinition);
  const conversationPackage = grpcPackage.conversation;

  const server = new grpc.Server();
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        return console.error(err);
      }
      server.start();
      console.log(`gRPC server listening on port ${port}`);
    }
  );

  // Simple unary and server streaming methods for testing purposes.
  server.addService(conversationPackage.Conversation.service, {
    SayHi: sayHi,
    Talk: talk,
    SayGoodbye: sayGoodbye,
  });
};

const sayHi = (call, callback) => {
  callback(null, { message: "Hi" });
};

const talk = (call, callback) => {
  let count = 0;
  const repeatable = setInterval(() => {
    if (count >= 10) {
      call.end();
      clearInterval(repeatable);
    }
    call.write({
      message: `Lorem ipsum dolor sit amet consectetur ${count}`,
    });
    count += 1;
  }, 100);
};

const sayGoodbye = (call, callback) => {
  callback(null, { message: "Hi" });
};

main();
