/*
Copyright 2026 Start9 Labs, Inc.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { type MatrixEvent, type Room, THREAD_RELATION_TYPE } from "matrix-js-sdk/src/matrix";

import { keylessComposerPlaceholder } from "./keylessComposerPlaceholder";

const roomWithCrypto = (crypto: boolean): Room => ({ client: { getCrypto: () => (crypto ? {} : undefined) } }) as Room;
const reply = {} as MatrixEvent;

describe("keylessComposerPlaceholder", () => {
    it("leaves the placeholder to upstream when the client has crypto", () => {
        expect(keylessComposerPlaceholder(roomWithCrypto(true))).toBeUndefined();
    });

    it("never calls a message unencrypted without crypto", () => {
        expect(keylessComposerPlaceholder(roomWithCrypto(false))).toBe("Send a message…");
        expect(keylessComposerPlaceholder(roomWithCrypto(false), reply)).toBe("Send a reply…");
        expect(
            keylessComposerPlaceholder(roomWithCrypto(false), reply, {
                rel_type: THREAD_RELATION_TYPE.name,
                event_id: "$root",
            }),
        ).toBe("Reply to thread…");
    });
});
