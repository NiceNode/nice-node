import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import ExternalLink from "../Link/ExternalLink";
import Caption from "../Typography/Caption";
import {
	labelAndDescriptionContainer,
	lineContainer,
	lineKeyText,
	lineValueText,
	sectionContainer,
	sectionHeaderContainer,
	sectionHeaderText,
} from "./labelSettingsSection.css";

export type LabelSettingsItem = {
	key?: string;
	label: ReactElement | string;
	value: ReactElement | string;
	description?: string;
	learnMoreLink?: string;
};
export interface LabelSettingsSectionProps {
	/**
	 * Title gets uppercased
	 */
	sectionTitle?: string;
	/**
	 * The sections label value items
	 */
	items: LabelSettingsItem[];
	type?: string;
}

const LabelSettingsSection = ({
	sectionTitle,
	items,
	type,
}: LabelSettingsSectionProps) => {
	const { t: g } = useTranslation("genericComponents");

	return (
		<div className={[sectionContainer, type].join(" ")}>
			{sectionTitle && (
				<div className={sectionHeaderContainer}>
					<div className={sectionHeaderText}>{sectionTitle}</div>
				</div>
			)}
			{items?.map((item, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div className={[lineContainer, item.key].join(" ")} key={index}>
					<div className={[labelAndDescriptionContainer, item.key].join(" ")}>
						<div className={lineKeyText}>{item.label}</div>
						<Caption type={type}>
							{item.description}{" "}
							{item.learnMoreLink && (
								<ExternalLink
									url={item.learnMoreLink}
									text={g("LearnMore")}
									inline
									hideIcon
								/>
							)}
						</Caption>
					</div>

					<div className={[lineValueText, item.key].join(" ")}>
						{item.value}
					</div>
				</div>
			))}
		</div>
	);
};

export default LabelSettingsSection;
