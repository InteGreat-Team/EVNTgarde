import React from "react";

type ModalProps = {
	open: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmColor?: string;
};

const ConfirmationModal: React.FC<ModalProps> = ({
	open,
	title,
	message,
	confirmLabel,
	cancelLabel = "Cancel",
	onConfirm,
	onCancel,
	confirmColor = "bg-[#0a4975] hover:bg-[#083a5c]",
}) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Blurred backdrop */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
			
			{/* Modal content */}
			<div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
				<div className="mb-2 font-bold text-[#0a4975] text-lg">{title}</div>
				<div className="mb-6 text-sm text-gray-800">{message}</div>
				<div className="flex gap-2">
					<button
						className="flex-1 border border-gray-300 rounded-lg py-2 font-medium bg-white hover:bg-gray-100 transition-colors"
						onClick={onCancel}
					>
						{cancelLabel}
					</button>
					<button
						className={`flex-1 rounded-lg py-2 font-medium text-white ${confirmColor} transition-colors`}
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal; 