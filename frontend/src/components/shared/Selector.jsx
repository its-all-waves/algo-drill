import './Selector.css'

// options = [
//     {
//         name: 'Pseudo Code',
//         value: 'pseudo-code'
//     },
//     {
//         name: 'Python',
//         value: 'python'
//     }
// ]

export default function Selector({ id, name, options, color }) {

    return (
        <select id={id} name={name} className='selector'>
            {options.map(opt => {
                return (
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.name}
                    </option>
                )
            })}
        </select>
    )
}