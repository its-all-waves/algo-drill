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

export default function Selector({ id, options, color }) {



    return (
        <select id={id} className='selector'>
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