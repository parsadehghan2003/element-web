/*
Copyright 2026 Start9 Labs, Inc.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { type JSX, useState } from "react";
import { IconButton } from "@vector-im/compound-web";
import ChevronLeftIcon from "@vector-im/compound-design-tokens/assets/web/icons/chevron-left";

import { _t } from "../../languageHandler";
import { usePhoneLayout } from "../../hooks/usePhoneLayout";

export interface PhoneTabs {
    /** The tabs are laid out for a phone: a list of tabs, or one tab's page. */
    phone: boolean;
    /** On a phone, the list of tabs is showing rather than a tab's page. */
    showingList: boolean;
    /** Show the active tab's page. */
    openPage: () => void;
    /** Go back from a tab's page to the list. */
    backToList: () => void;
}

/**
 * A tabbed settings dialog on a phone is a list of its tabs; picking one shows that tab alone, with a way back to the
 * list. A dialog opened on its first tab starts on the list; one opened on another tab (a link straight to, say,
 * notification settings) starts on that tab's page.
 */
export function usePhoneTabs(activeTabId: string, firstTabId: string, tabsOnLeft: boolean): PhoneTabs {
    const phone = usePhoneLayout() && tabsOnLeft;
    const [showingList, setShowingList] = useState(() => activeTabId === firstTabId);
    return {
        phone,
        showingList: phone && showingList,
        openPage: () => setShowingList(false),
        backToList: () => setShowingList(true),
    };
}

/** The top of a tab's page on a phone: a back button to the list and the tab's name. */
export function PhoneTabHeader({ label, onBack }: { label: string; onBack: () => void }): JSX.Element {
    return (
        <div className="mx_TabbedView_phoneHeader">
            <IconButton aria-label={_t("action|back")} onClick={onBack} size="32px">
                <ChevronLeftIcon />
            </IconButton>
            <h2 className="mx_TabbedView_phoneHeader_title">{label}</h2>
        </div>
    );
}
