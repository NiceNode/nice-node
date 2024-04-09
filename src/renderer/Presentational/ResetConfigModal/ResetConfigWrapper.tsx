import { useEffect } from "react";
import { useAppSelector } from "../../state/hooks";
import { selectSelectedNode } from "../../state/node";
import type { ModalConfig } from "../ModalManager/modalUtils";

export interface ResetConfigWrapperProps {
	modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
}

const ResetConfigWrapper = ({
	modalOnChangeConfig,
}: ResetConfigWrapperProps) => {
	const selectedNode = useAppSelector(selectSelectedNode);

	useEffect(() => {
		modalOnChangeConfig({ selectedNode });
	}, [selectedNode]);

	return <></>;
};

export default ResetConfigWrapper;
