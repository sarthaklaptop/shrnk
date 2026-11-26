"use client";

import { MdAttachFile, MdCheck, MdImage, MdSend } from "react-icons/md";
import { Button, Chip, Spinner, Stage, States, Text, Window, type Act } from "@/components/stageshow";
import "@/components/home/shrnk-look.css";
import "./compose-demo.css";

// What a useful message to Shrnk looks like, written in front of the
// reader. Corner bleed (framing.md): a compose window inset top and left in a
// quiet well, off the right and the bottom. Beats:
//   1. The subject types itself into its line.
//   2. The body types: the short link first, then what went wrong.
//   3. The cursor attaches a screenshot; its chip opens beside the clip.
//   4. Send: the button works, then says Sent on itself.
// Plays once in view. The address, the subject, the body and the file are
// the real strings; the window's toolbar is quiet.

type Pay = "idle" | "busy" | "done";
type S = { subject: string; body: string; file: boolean; pay: Pay };

const SUBJECT = "Short link not redirecting";
const BODY = "Link: shrnk-six.vercel.app/hN3xQe\nSince this morning it opens an error page instead of my site.";

const initial: S = { subject: "", body: "", file: false, pay: "idle" };
const POSTER: S = { subject: SUBJECT, body: BODY, file: true, pay: "done" };

async function script(a: Act<S>) {
  await a.wait(700);
  a.mark("subject");
  await a.type("subject", SUBJECT, { interval: 34 });
  await a.wait(300);
  a.mark("body");
  await a.type("body", BODY, { interval: 22 });
  await a.wait(400);

  a.mark("attach");
  await a.click({ at: "attach", x: 0.8, y: 0.8 });
  await a.set({ file: true });
  await a.wait(800);

  a.mark("send");
  await a.click({ at: "send", x: 0.9, y: 0.82 });
  await a.set({ pay: "busy" });
  await a.wait(800);
  await a.set({ pay: "done" });
  await a.move("rest");
  await a.wait(2200);
}

const REST = { wide: { x: 470, y: 330 }, compact: { x: 270, y: 300 } };

export default function ComposeDemo() {
  return (
    <Stage<S>
      width={560}
      height={360}
      compact={{ below: 560, width: 326, height: 320 }}
      initial={initial}
      poster={POSTER}
      play="once"
      script={script}
      cursor={{ at: REST }}
      className="shrnk-look cm"
    >
      {(s, _rect, layout) => {
        const typingSubject = s.subject.length > 0 && s.subject.length < SUBJECT.length;
        const typingBody = s.body.length > 0 && s.body.length < BODY.length;
        return (
          <>
            <Window title="New message" className="cm-window">
              <div className="cm-mail">
                <div className="cm-fields">
                <div className="cm-line">
                  <Text className="cm-key">To</Text>
                  <span className="cm-to">shrnk.contact@gmail.com</span>
                </div>
                <div className="cm-line">
                  <Text className="cm-key">Subject</Text>
                  <span className="cm-subject" data-typing={typingSubject || undefined}>
                    {s.subject}
                    <span className="cm-caret" data-on={(s.subject.length > 0 && !s.body) || undefined} />
                  </span>
                </div>
                </div>
                <div className="cm-body" data-typing={typingBody || undefined}>
                  {s.body}
                  <span className="cm-caret" data-on={(s.body.length > 0 && !s.file) || undefined} />
                </div>
                <div className="cm-foot">
                  <Button variant={s.pay === "done" ? "secondary" : "primary"} size="large" className="cm-send" data-target="send">
                    <States
                      value={s.pay}
                      states={{
                        idle: (
                          <span className="cm-inline cm-inline--send">
                            Send <MdSend size={14} />
                          </span>
                        ),
                        busy: <Spinner />,
                        done: (
                          <span className="cm-inline">
                            <MdCheck size={14} /> Sent
                          </span>
                        ),
                      }}
                    />
                  </Button>
                  <span className="cm-tool" data-target="attach" data-cursor="pointer" aria-hidden>
                    <MdAttachFile size={18} />
                  </span>
                  {/* The attachment opens its own width beside the clip, so nothing moves */}
                  <Chip show={s.file} gap={12} className="cm-file">
                    <MdImage size={14} />
                    screenshot.png
                  </Chip>
                </div>
              </div>
            </Window>
            <span data-target="rest" style={{ position: "absolute", left: REST[layout].x, top: REST[layout].y }} />
          </>
        );
      }}
    </Stage>
  );
}
