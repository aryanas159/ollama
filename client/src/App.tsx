import { useState, useEffect } from "react";
import axios from "axios";

function App() {
	const [models, setModels] = useState<any[]>([]);
	const [currentModel, setCurrentModel] = useState<any>(null);
	const [messages, setMessages] = useState<any[]>([]);
	useEffect(() => {
		const getModels = async () => {
			const { data } = await axios.get("http://localhost:3000/list");
			setModels(data.models);
			console.log(data);
		};
		getModels();
	}, []);
	useEffect(() => {
		setMessages([]);
	}, [currentModel]);
	const sendMessage = async () => {
		
		const newMessages = [...messages, { role: "user", content: "hello" }];
    setMessages(newMessages);
		const { data } = await axios.post("http://localhost:3000/chat", {
			model: currentModel,
			messages: newMessages,
		});
		setMessages([...newMessages, data.message]);
	};
	return (
		<>
			<h1>Models</h1>
			{models.map(({ model }) => {
				return (
					<div key={model} onClick={() => setCurrentModel(model)}>
						<h3>{model}</h3>
					</div>
				);
			})}

			{currentModel && (
				<>
					<h1>{currentModel}</h1>
					{messages.map((message, index) => {
						return (
							<div key={index}>
								<h3>{message.role}</h3>
								<p>{message.content}</p>
							</div>
						);
					})}
					<button onClick={sendMessage}>Send Message</button>
				</>
			)}
		</>
	);
}

export default App;
