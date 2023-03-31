import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { Backdrop, Box, Fade, IconButton, Modal, TextField, Typography, Divider } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import ReactQuill from 'react-quill';

import type { Task } from '../utils/types';
import 'react-quill/dist/quill.snow.css';

interface PropsType {
	task: Task | undefined
	closeModal: () => void
	onUpdate: (task: Task) => Promise<void>
	onDelete: (task: Task) => Promise<void>
}

const modalStyle = {
	outline: 'none',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50%',
	bgcolor: 'background.paper',
	border: '0px solid #000',
	boxShadow: 24,
	p: 1,
	height: '80%',
};

function TaskModal({ task, closeModal, onUpdate, onDelete }: PropsType): JSX.Element {
	const [data, setData] = useState<Task | undefined>();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	useEffect(() => {
		setData(task);
		if (task) {
			setTitle(task.title ?? '');
			setContent(task.content ?? '');
		}
	}, [task]);

	const handleChangeTitle = (newTitle: string): void => {
		if (data) {
			const newData = { ...data, title: newTitle };
			onUpdate(newData);
			setData(newData);
			setTitle(newTitle);
		}
	};

	const handleChangeContent = (newContent: string): void => {
		if (data) {
			const newData = { ...data, content: newContent };
			onUpdate(newData);
			setData(newData);
			setContent(newContent);
		}
	};

	const handleDeleteTask = (): void => {
		if (data) {
			onDelete(data);
			closeModal();
		}
	};

	return (
		<Modal
			open={data !== undefined}
			onClose={closeModal}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{ backdrop: { timeout: 500 } }}
		>
			<Fade in={data !== undefined}>
				<Box sx={modalStyle}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							width: '100%',
						}}
					>
						<IconButton color="error" onClick={handleDeleteTask}>
							<DeleteOutlined />
						</IconButton>
					</Box>
					<Box
						sx={{
							display: 'flex',
							height: '100%',
							flexDirection: 'column',
							padding: '2rem 5rem 5rem',
						}}
					>
						<TextField
							value={title}
							onChange={(e) => { handleChangeTitle(e.target.value); }}
							placeholder="Untitled"
							variant="outlined"
							fullWidth
							sx={{
								width: '100%',
								'& .MuiOutlinedInput-input': { padding: 0 },
								'& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
								'& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
								marginBottom: '8px',
							}}
						/>
						<Typography variant="body2" fontWeight="700">
							{data !== undefined ? moment(data.createdAt).format('YYYY-MM-DD') : ''}
						</Typography>
						<Divider sx={{ margin: '1.5rem 0' }} />
						<Box
							sx={{
								overflowX: 'hidden',
								overflowY: 'auto',
							}}
						>
							<ReactQuill
								modules={{
									toolbar: [
										[{ header: [1, 2, 3, false] }],
										['bold', 'italic', 'underline', 'strike', 'blockquote'],
										[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
										['link', 'image'],
										['clean'],
									],
								}}
								formats={['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image']}
								value={content}
								onChange={(value) => { handleChangeContent(value); }}
							/>
						</Box>
					</Box>
				</Box>
			</Fade>
		</Modal>
	);
}

export default TaskModal;
