import { useContext } from 'react';
import { Link } from 'react-router-dom';

import GlobalContext from '../../context/GlobalContext';

export default function TableButtons(props) {
	const status = props.status;
	const data = props.data;
	const disableButton = (data.length === 1 && data[0].isPlaceholder);

	const { setIsBodyLoading } = useContext(GlobalContext);

	const handleAddNewRow = () => {
		props.onAddNewRow();
	}

	const handleDeleteEntries = () => {
    props.onDeleteRows();
	}

	const handleResetData = () => {
    props.onResetData();
  }

  const handleSubmit = () => {
    props.onSubmit();
  }

	return (
		<div className='button-container d-flex justify-content-center rounded p-2'>
			{status==='createLog' &&
				<Link to='/log' className='btn table-btn mx-4' onClick={() => setIsBodyLoading(true)}>
					<svg height='24' width='24' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path fill="white" d="M11.293,7.293l-3.9997,3.99969a1.00354,1.00354,0,0,0,0,1.41468L11.293,16.707A.99989.99989,0,0,0,12.707,15.293L10.41406,13H16a1,1,0,0,0,0-2H10.41406l2.293-2.293A.99989.99989,0,0,0,11.293,7.293Z"/>
						<path fill="#FFA203" d="M2,12A10,10,0,1,0,12,2,10.01114,10.01114,0,0,0,2,12ZM12.707,7.293a.99963.99963,0,0,1,0,1.41406L10.41406,11H16a1,1,0,0,1,0,2H10.41406l2.293,2.293A.99989.99989,0,0,1,11.293,16.707l-3.9997-3.99969a1.00354,1.00354,0,0,1,0-1.41468L11.293,7.293A.99962.99962,0,0,1,12.707,7.293Z"/>
					</svg>
				</Link>
			}
			{status!=='createLog' &&
				<button type='button' className='btn table-btn mx-4' disabled={disableButton} onClick={handleDeleteEntries}>
					<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
						<g transform="translate(0 -1028.4)">
							<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#c0392b" transform="translate(0 1029.4)"/>
							<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#e74c3c" transform="translate(0 1028.4)"/>
							<path d="m6 1039.4h12v4h-12z" fill="#c0392b"/><path d="m6 1039.4h12v3h-12z" fill="#ecf0f1"/>
						</g>
					</svg>
				</button>
			}
			<button type='button' className='btn table-btn mx-4' disabled={disableButton} onClick={handleResetData}>
				<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
					<g transform="translate(0 -1028.4)">
						<path d="m22 12a10 10 0 1 1 -20 0 10 10 0 1 1 20 0z" fill="#2980b9" transform="matrix(-1 0 0 1 24 1029.4)"/>
						<path d="m22 12a10 10 0 1 1 -20 0 10 10 0 1 1 20 0z" fill="#fc9000" transform="matrix(-1 0 0 1 24 1028.4)"/>
						<path d="m22 12a10 10 0 1 1 -20 0 10 10 0 1 1 20 0z" fill="#2980b9" transform="matrix(-1 0 0 1 -61 1007.4)"/>
						<path d="m22 12a10 10 0 1 1 -20 0 10 10 0 1 1 20 0z" fill="#3498db" transform="matrix(-1 0 0 1 -61 1006.4)"/>
						<path d="m-73 1014.4c-2.416 0-4.44 1.7-4.906 4h1.656c.445-1.4 1.732-2.5 3.281-2.5.938 0 1.79.4 2.407 1l-1.438 1.5h2.312 1.594.094v-4l-1.469 1.4c-.907-.9-2.151-1.4-3.531-1.4zm-5 6v4l1.469-1.5c.907.9 2.151 1.5 3.531 1.5 2.416 0 4.44-1.8 4.906-4h-1.656c-.445 1.4-1.732 2.4-3.281 2.4-.938 0-1.79-.4-2.407-1l1.438-1.4h-2.312-1.594z" fill="#2980b9"/>
						<path d="m-73 1013.4c-2.416 0-4.44 1.7-4.906 4h1.656c.445-1.4 1.732-2.5 3.281-2.5.938 0 1.79.4 2.407 1l-1.438 1.5h2.312 1.594.094v-4l-1.469 1.4c-.907-.9-2.151-1.4-3.531-1.4zm-5 6v4l1.469-1.5c.907.9 2.151 1.5 3.531 1.5 2.416 0 4.44-1.8 4.906-4h-1.656c-.445 1.4-1.732 2.4-3.281 2.4-.938 0-1.79-.4-2.407-1l1.438-1.4h-2.312-1.594z" fill="#ecf0f1"/>
						<path d="m12 1035.4c-2.9756 0-5.4333 2.1-5.9062 5h2.0624c.4447-1.8 1.9808-3 3.8438-3 1.366 0 2.537.7 3.25 1.7l-1.25 1.3h1.844 2.062.094v-4l-1.281 1.2c-1.095-1.4-2.804-2.2-4.719-2.2zm-6 7v4l1.2812-1.3c1.095 1.4 2.8038 2.3 4.7188 2.3 2.976 0 5.433-2.2 5.906-5h-2.062c-.445 1.7-1.981 3-3.844 3-1.366 0-2.5369-.7-3.25-1.8l1.25-1.2h-1.8438-2.0624z" fill="#2980b9"/>
						<path d="m12 6c-2.9756 0-5.4333 2.1586-5.9062 5h2.0624c.4447-1.7243 1.9808-3 3.8438-3 1.366 0 2.537.7043 3.25 1.75l-1.25 1.25h1.844 2.062.094v-4l-1.281 1.2812c-1.095-1.3953-2.804-2.2812-4.719-2.2812zm-6 7v4l1.2812-1.281c1.095 1.395 2.8038 2.281 4.7188 2.281 2.976 0 5.433-2.159 5.906-5h-2.062c-.445 1.724-1.981 3-3.844 3-1.366 0-2.5369-.704-3.25-1.75l1.25-1.25h-1.8438-2.0624z" fill="#ecf0f1" transform="translate(0 1028.4)"/>
					</g>
				</svg>
			</button>
			{status==='log' &&
				<Link to='/log/create' className='btn table-btn mx-4' onClick={() => setIsBodyLoading(true)}>
					<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
						<g transform="translate(0 -1028.4)">
							<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#27ae60" transform="translate(0 1029.4)"/>
							<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#2ecc71" transform="translate(0 1028.4)"/>
							<path d="m6.0001 1042.4h4.9999v5h2v-5h5v-2h-5v-5h-2v5h-4.9999z" fill="#27ae60"/>
							<path d="m6 1041.4h5v5h2v-5h5v-2h-5v-5h-2v5h-5z" fill="#ecf0f1"/>
						</g>
					</svg>
				</Link>
			}

			{status==='index' &&
				<button type='button' className='btn table-btn mx-4' disabled={disableButton} onClick={handleAddNewRow}>
					<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
						<g transform="translate(0 -1028.4)">
							<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#27ae60" transform="translate(0 1029.4)"/>
							<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#2ecc71" transform="translate(0 1028.4)"/>
							<path d="m6.0001 1042.4h4.9999v5h2v-5h5v-2h-5v-5h-2v5h-4.9999z" fill="#27ae60"/>
							<path d="m6 1041.4h5v5h2v-5h5v-2h-5v-5h-2v5h-5z" fill="#ecf0f1"/>
						</g>
					</svg>
				</button>
			}

			<button type='button' className='btn table-btn mx-4' disabled={disableButton} onClick={handleSubmit}>
				<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
					<g transform="translate(0 -1028.4)">
						<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#27ae60" transform="translate(0 1029.4)"/>
						<path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#2ecc71" transform="translate(0 1028.4)"/>
						<path d="m16 1037.4-6 6-2.5-2.5-2.125 2.1 2.5 2.5 2 2 .125.1 8.125-8.1z" fill="#27ae60"/>
						<path d="m16 1036.4-6 6-2.5-2.5-2.125 2.1 2.5 2.5 2 2 .125.1 8.125-8.1z" fill="#ecf0f1"/>
					</g>
				</svg>
			</button>
		</div>
	);
}
