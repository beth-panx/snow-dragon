import * as builder from "botbuilder";
import * as express from "express";
import * as crypto from "crypto";
import * as debug from "debug";
import { OutgoingWebhookDeclaration, IOutgoingWebhook } from "express-msteams-host";
import { stringLiteralsArray } from "@fluentui/react";

const log = debug("msteams");
const incomingQueue =  Array<{ id: string | undefined; text: string; from: string }>();

/**
 * Implementation for Snow Dragon Outgoing Webhook
 */
@OutgoingWebhookDeclaration("/api/webhook")
export class SnowDragonOutgoingWebhook implements IOutgoingWebhook {
    /**
     * The constructor
     */
    public constructor() {
    }

    /**
     * Implement your outgoing webhook logic here
     * @param req the Request
     * @param res the Response
     * @param next
     */

    public requestHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
        // parse the incoming message
        const incoming = req.body as builder.Activity;

        // create the response, any Teams compatible responses can be used
        const message: Partial<builder.Activity> = {
            type: builder.ActivityTypes.Message
        };

        const securityToken = process.env.SECURITY_TOKEN;
        if (securityToken && securityToken.length > 0) {
            // There is a configured security token
            const auth = req.headers.authorization;
            const msgBuf = Buffer.from((req as any).rawBody, "utf8");
            const msgHash = "HMAC " + crypto.
                createHmac("sha256", new Buffer(securityToken as string, "base64")).
                update(msgBuf).
                digest("base64");

            if (msgHash === auth) {
                // Message was ok and verified

                log("incoming: " + typeof(incoming.text));
                log("queue: " + JSON.stringify(incomingQueue));
                const searchVal = "next question";
                let followupText = `You have reached the end of the question queue. Yay! 🙌`;
                if ((incoming.text.toLowerCase().includes(searchVal))) {
                    // dequeue incomingQueue
                    if (incomingQueue.length > 0) {
                        const nextQ = incomingQueue.shift();
                        if (nextQ) {
                            // replace @Snow Dragon
                            const nextQText = nextQ.text.replace(/<at>Snow Dragon<\/at> ?/g, "");
                            const numberQLeft = incomingQueue.length;
                            if (numberQLeft > 0) {
                                followupText = `You have ${numberQLeft} more questions in the queue.`;
                            }
                            message.text = `🤓From: @${nextQ.from}\n\n🦒Question: ${nextQText}\n\n👀${followupText}`;

                        } else {
                            message.text = `${followupText}`;
                        }
                    } else {
                        message.text = `${followupText}`;
                    }
                } else {
                    // enqueue incomingQueue
                    const item = {
                        id: incoming.id,
                        text: incoming.text,
                        from: incoming.from.name
                    };
                    incomingQueue.push(item);
                    message.text = `Your request has been added to a queue. We will notify you when it's your turn to speak. 😎`;
                }
            } else {
                // Message could not be verified
                message.text = `Error: message sender cannot be verified`;
            }
        } else {
            // There is no configured security token
            message.text = `Error: outgoing webhook is not configured with a security token`;
        }

        // send the message
        res.send(JSON.stringify(message));
    }
}
