import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions/Actions'

let AddTodo = ({ dispatch }) => {
	let input 

	return (
		<div>
			<input ref={(node) => {
				input = node
			}} />
			<button onClick={() => {
				dispatch(addTodo(input.value))
				input.value = ''
			}}>
				AddTodo
			</button>
		</div>
	);
}

AddTodo = connect()(AddTodo)

export default AddTodo