// @vitest-environment happy-dom

// import { render } from "@testing-library/react";
import { render } from "./text-utils";
import {
	type Mock,
	expect,
	vi,
	beforeAll,
	afterAll,
	describe,
	it,
} from "vitest";
import "@vanilla-extract/css/disableRuntimeStyles";

console.log("hello");

import App from "../../renderer/App";

vi.mock("../../renderer/electronGlobal");

type MockedI18N = {
	t: (key: string) => string;
	changeLanguage: Mock;
	init: Mock;
	use: (plugin: any) => MockedI18N;
};

vi.mock("@sentry/electron/renderer", () => {
	return {
		init: vi.fn(() => {
			return {};
		}),
	};
});

vi.mock("../../renderer/i18n", () => {
	const i18nMock: MockedI18N = {
		// Mock any other properties or methods if needed
		t: (k: any) => k, // just return the key for simplicity
		changeLanguage: vi.fn(),
		init: vi.fn(),
		use: vi.fn(() => i18nMock), // for chaining .use() calls
	};

	return i18nMock;
});

// Also mock react-i18next hooks and methods
vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: any) => key,
		i18n: {
			changeLanguage: vi.fn(),
		},
	}),
	withTranslation: () => (Component: any) => Component,
}));

// this is just a little hack to silence a warning that we'll get until we
// upgrade to 16.9. See also: https://github.com/facebook/react/pull/14853
const originalError = console.error;
beforeAll(() => {
	console.error = (...args) => {
		if (/Warning.*not wrapped in act/.test(args[0])) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});

describe("App", () => {
	it("should render", () => {
		expect(render(<App />)).toBeTruthy();
	});
});
