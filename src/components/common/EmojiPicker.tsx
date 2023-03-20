import React, { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { Picker } from 'emoji-mart';
import type { BaseEmoji } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css';

interface PropsType {
	icon: string
	onChangeIcon: (newIcon: string) => void
}

function EmojiPicker({ icon, onChangeIcon }: PropsType): JSX.Element {
	const [selectedEmoji, setSelectedEmoji] = useState('');
	const [isShowPicker, setIsShowPicker] = useState(false);

	useEffect(() => {
		if (icon) {
			setSelectedEmoji(icon);
		}
	}, [icon]);

	const handleSelectEmoji = (e: BaseEmoji): void => {
		const sym = e.unified.split('-');
		const codesArray: number[] = [];
		sym.forEach((el) => codesArray.push(Number(`0x${el}`)));
		const emoji = String.fromCodePoint(...codesArray);
		setIsShowPicker(false);
		onChangeIcon(emoji);
	};

	const setShowPicker = (): void => { setIsShowPicker(!isShowPicker); };

	return (
		<Box sx={{ position: 'relative', width: 'max-content' }}>
			<Typography
				variant="h3"
				fontWeight="700"
				sx={{ cursor: 'pointer' }}
				onClick={setShowPicker}
			>
				{selectedEmoji}
			</Typography>
			<Box
				sx={{
					display: isShowPicker ? 'block' : 'none',
					position: 'absolute',
					top: '100%',
					zIndex: '9999',
				}}
			>
				<Picker theme="dark" onSelect={handleSelectEmoji} showPreview={false} />
			</Box>
		</Box>
	);
}

export default EmojiPicker;
