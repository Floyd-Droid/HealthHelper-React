import React, { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";

export default function NotFoundPage() {
	const { setIsBodyLoading } = useContext(GlobalContext)

	React.useEffect(() => {
		setIsBodyLoading(false)
	}, [])

	return (
		<div className='container d-flex justify-content-center mt-5'>
			<div className='login-container rounded bg-form'>
				<div className='container-fluid title-container d-flex justify-content-center bg-title p-2'>
					<h2 className='text-white'>
					<div className='d-flex justify-content-start align-items-center'>
						<div className='d-flex justify-content-start align-items-center'>
							<svg height='24' width='24' enableBackground="new 0 0 48 48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
								<path d="m21.2 44.8-18-18c-1.6-1.6-1.6-4.1 0-5.7l18-18c1.6-1.6 4.1-1.6 5.7 0l18 18c1.6 1.6 1.6 4.1 0 5.7l-18 18c-1.6 1.6-4.2 1.6-5.7 0z" fill="#f44336"/>
								<path d="m21.6 32.7c0-.3.1-.6.2-.9s.3-.5.5-.7.5-.4.8-.5.6-.2 1-.2.7.1 1 .2.6.3.8.5.4.4.5.7.2.6.2.9-.1.6-.2.9-.3.5-.5.7-.5.4-.8.5-.6.2-1 .2-.7-.1-1-.2-.5-.3-.8-.5c-.2-.2-.4-.4-.5-.7s-.2-.5-.2-.9zm4.2-4.6h-3.6l-.5-15.1h4.6z" fill="#fff"/>
							</svg>
						</div>
						<div className='ms-2'>
							<span>404</span>
						</div>
						</div>

					</h2>
				</div>
				<div className='container d-flex flex-column justify-content-around align-items-center my-4'>
					<p className='text-white'>Sorry, but the page you are looking for doesn't exist.</p>
				</div>
			</div>
		</div>
	)
}