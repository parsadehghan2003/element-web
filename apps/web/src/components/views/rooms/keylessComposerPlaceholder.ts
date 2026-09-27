/*
Copyright 2026 Start9 Labs, Inc.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { type IEventRelation, type MatrixEvent, type Room, THREAD_RELATION_TYPE } from "matrix-js-sdk/src/matrix";

import { _t } from "../../../languageHandler";

/**
 * Without crypto every room is unencrypted, so the composer says "Send a message…" rather than calling each
 * message unencrypted. Undefined when the client has crypto, leaving upstream's placeholder in charge.
 */
export function keylessComposerPlaceholder(
    room: Room,
    replyToEvent?: MatrixEvent,
    relation?: IEventRelation,
): string | undefined {
    if (room.client.getCrypto()) return undefined;
    if (!replyToEvent) return _t("composer|placeholder_encrypted");
    if (relation?.rel_type === THREAD_RELATION_TYPE.name) return _t("composer|placeholder_thread_encrypted");
    return _t("composer|placeholder_reply_encrypted");
}
