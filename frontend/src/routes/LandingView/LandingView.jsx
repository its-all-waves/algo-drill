import { Form, redirect, useLoaderData, useOutletContext } from 'react-router-dom'

import './LandingView.css'
import GlassPane from '../../components/shared/GlassPane'
import Button from '../../components/shared/Button'
import Selector from '../../components/shared/Selector'

import menuIcon from '../../assets/icons/Menu-Alt.svg'
import { useContext } from 'react'
import { RootContext } from '../../rootContext'

export async function loader({ request }) {
    const LANG_OPTIONS = [
        { name: 'Pseudo Code', value: 'pseudo-code' },
        { name: 'Python', value: 'python' }
    ]
    const ALGO_OPTIONS = [
        { name: 'Merge Sort', value: 'merge-sort' },
        { name: 'Bubble Sort', value: 'bubble-sort' }
    ]

    return { LANG_OPTIONS, ALGO_OPTIONS }
}

export default function LandingView() {
    const { setMenuOpen } = useContext(RootContext)

    return (
        <div id='landing-view'>
            <GlassPane>
                <div style={{ margin: 'auto auto' }}>
                    <HeroText />
                    <StartForm />
                </div>
                <button
                    type='button'
                    className='main-menu-button'
                    onClick={() => setMenuOpen(true)}
                >
                    <img src={menuIcon} alt='Open Menu' />
                </button>
            </GlassPane>
        </div>
    )
}


function StartForm({ }) {
    const options = useLoaderData()

    return (
        <Form action="/test" id='start-form'>
            <div className="form-field">
                <label htmlFor='select-language'>Language</label>
                <Selector name='lang' id='select-language' options={options.LANG_OPTIONS} />
            </div>

            <div className="form-field">
                <label htmlFor='select-algorithm'>Algorithm</label>
                <Selector name='algo' id='select-algorithm' options={options.ALGO_OPTIONS} />
            </div>

            <Button text='⇨' type='submit' />
        </Form>
    )
}

function HeroText() {
    return (
        <div id="hero-text">
            <div className="hero-main-wrapper">
                <h1>Memorize common algorithms.</h1>
                <h1>
                    Practice typing source code
                    & special characters.
                </h1>
            </div>
            <h2>
                <a href='#'>Log in</a> to submit an algo and see your stuff, or
                choose from the options below to get started.
            </h2>
        </div>
    )
}