import { Hono } from "hono";
import { type Answer, makeAnswer } from "@/app/chat/answer";
import { makeListTree } from "@/app/content/listTree";
import { makeOpenBuffer } from "@/app/content/openBuffer";
import { AGENT_CONTEXT, CONTENT } from "@/content.generated";
import { appError, SystemErrorCode } from "@/core/error";
import { makePlan, makeStreamAnswer } from "@/infra/chat/llm";
import {
  type KvStore,
  makeRateLimit,
  noopRateLimit,
} from "@/infra/chat/rateLimit";
import { stubPlan, stubStreamAnswer } from "@/infra/chat/stubLlm";
import { readLlmConfig } from "@/infra/config";
import {
  makeReadBuffer,
  makeReadIndex,
  makeReadTree,
} from "@/infra/content/contentAdapter";
import { makeClient } from "@/infra/openai/client";
import { errorToHttp } from "@/interfaces/web/errorMapper";
import { makeBufferRoutes } from "@/interfaces/web/routes/buffer";
import { makeChatRoutes } from "@/interfaces/web/routes/chat";
import { ErrorPage } from "@/interfaces/web/views/pages/errorPage";

const BRANCH = "main";
const PER_IP_PER_DAY = 10;
const GLOBAL_PER_DAY = 600;
const OFF_TOPIC =
  "I only answer questions about Akshith, his work, and how to reach him. Ask me about his projects, skills, or experience.";

const kvOf = (env: unknown): KvStore | undefined =>
  typeof env === "object" && env !== null
    ? (env as { CHAT?: KvStore }).CHAT
    : undefined;

const makeChatAnswer = (env: unknown): Answer => {
  const llm = readLlmConfig(env);
  const kv = kvOf(env);
  const knownPaths = new Set(Object.keys(CONTENT.buffers));
  const client = llm.apiKey !== "" ? makeClient(llm) : null;
  return makeAnswer({
    limit: kv
      ? makeRateLimit({
          kv,
          perIpPerDay: PER_IP_PER_DAY,
          globalPerDay: GLOBAL_PER_DAY,
        })
      : noopRateLimit,
    plan: client
      ? makePlan(client, llm.model, llm.extraBody, knownPaths)
      : stubPlan,
    stream: client
      ? makeStreamAnswer(client, llm.model, llm.extraBody, AGENT_CONTEXT)
      : stubStreamAnswer,
    offTopic: OFF_TOPIC,
  });
};

export const makeApp = (env: unknown): Hono => {
  const openBuffer = makeOpenBuffer({ readBuffer: makeReadBuffer() });
  const listTree = makeListTree({ readTree: makeReadTree() });
  const readIndex = makeReadIndex();

  const app = new Hono();
  app.route("/", makeChatRoutes({ answer: makeChatAnswer(env) }));
  app.route(
    "/",
    makeBufferRoutes({
      openBuffer,
      listTree,
      readIndex,
      branch: BRANCH,
    }),
  );

  app.notFound((c) =>
    c.html(
      <ErrorPage
        status={404}
        line={`E484: Can't open file ${c.req.path.replace(/^\//, "")}`}
        branch={BRANCH}
      />,
      404,
    ),
  );

  app.onError((error, c) => {
    console.error("unhandled", error);
    const { status, line } = errorToHttp(
      appError(SystemErrorCode.INTERNAL, "E5108: internal error"),
    );
    return c.html(
      <ErrorPage status={status} line={line} branch={BRANCH} />,
      status,
    );
  });

  return app;
};
