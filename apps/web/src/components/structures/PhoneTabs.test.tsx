/*
Copyright 2026 Start9 Labs, Inc.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

// @vitest-environment happy-dom
import React, { useState } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "test-utils-rtl";

import TabbedView, { Tab } from "./TabbedView";
import { type NonEmptyArray } from "../../@types/common";

type TabId = "general" | "notifications" | "advanced";

const tabs: NonEmptyArray<Tab<TabId>> = [
    new Tab("general", "common|general", null, <div>General body</div>),
    new Tab("notifications", "notifications|enable_prompt_toast_title", null, <div>Notifications body</div>),
    new Tab("advanced", "common|advanced", null, <div>Advanced body</div>),
];

function Harness({ initialTabId = "general" }: { initialTabId?: TabId }): React.JSX.Element {
    const [active, setActive] = useState<TabId>(initialTabId);
    return <TabbedView tabs={tabs} activeTabId={active} onChange={setActive} />;
}

describe("TabbedView on a phone", () => {
    const original = window.matchMedia;
    afterEach(() => {
        window.matchMedia = original;
    });

    const mockPhone = (matches: boolean): void => {
        window.matchMedia = vi.fn().mockReturnValue({
            matches,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }) as unknown as typeof window.matchMedia;
    };

    const tabbedView = (container: HTMLElement): Element => container.querySelector(".mx_TabbedView")!;

    it("opens on the list of tabs, then shows a picked tab's page with a way back", () => {
        mockPhone(true);
        const { container } = render(<Harness />);
        expect(tabbedView(container)).toHaveClass("mx_TabbedView_phoneList");
        expect(screen.queryByRole("button", { name: "Back" })).toBeNull();

        fireEvent.click(screen.getByTestId("settings-tab-advanced"));
        expect(tabbedView(container)).toHaveClass("mx_TabbedView_phonePage");
        expect(screen.getByText("Advanced body")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Advanced" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(tabbedView(container)).toHaveClass("mx_TabbedView_phoneList");
    });

    it("opens straight on the page of a tab other than the first", () => {
        mockPhone(true);
        const { container } = render(<Harness initialTabId="advanced" />);
        expect(tabbedView(container)).toHaveClass("mx_TabbedView_phonePage");
        expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    });

    it("keeps the side-by-side layout off a phone", () => {
        mockPhone(false);
        const { container } = render(<Harness />);
        expect(tabbedView(container)).not.toHaveClass("mx_TabbedView_phoneList");
        expect(tabbedView(container)).not.toHaveClass("mx_TabbedView_phonePage");
        expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    });
});
