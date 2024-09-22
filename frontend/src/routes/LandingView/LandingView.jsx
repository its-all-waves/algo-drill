import './LandingView.css'

import GlassPane from '../../components/shared/GlassPane'
import Button from '../../components/shared/Button'
import Selector from '../../components/shared/Selector'

export default function LandingView() {


    return (
        <div id='landing-view'>
            <GlassPane>
                <HeroText />
                <StartForm />
            </GlassPane>
        </div>
    )
}


function StartForm() {

    const LANG_OPTIONS = [
        {
            name: 'Pseudo Code',
            value: 'pseudo-code'
        },
        {
            name: 'Python',
            value: 'python'
        }
    ]

    const ALGO_OPTIONS = [
        {
            name: 'Merge Sort',
            value: 'merge-sort'
        },
        {
            name: 'Bubble Sort',
            value: 'bubble-sort'
        }
    ]

    return (
        <form action="" id='start-form'>
            <div className="form-field">
                <label htmlFor='select-language'>Language</label>
                <Selector id='select-language' options={LANG_OPTIONS} />
            </div>
            
            <div className="form-field">
                <label htmlFor='select-algorithm'>Algorithm</label>
                <Selector id='select-algorithm' options={ALGO_OPTIONS} />
            </div>
            
            <Button text='⇨' action={() => console.log('ACTION!')} />
        </form>
    )
}

function HeroText({ children }) {
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