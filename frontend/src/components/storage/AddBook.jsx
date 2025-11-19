import React from 'react'

const AddBook = () => {
	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
			<h2 className='text-2xl font-bold mb-6'>Add book</h2>
			<form>
				<div>
					<label htmlFor="book-name"
						className='text-sm font-medium text-gray-700'>
							Book name
					</label>
					<input type="text" name="book-name" placeholder='Enter book name' required
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"></input>
				</div>
				<div>
					<label htmlFor="book-description"
						className='block text-sm font-medium text-gray-700'>
							Description
					</label>
					<textarea name="book-description" placeholder="Enter description"></textarea>
				</div>
			</form>
			<button>Add book</button>
		</div>
	)
}

export default AddBook
