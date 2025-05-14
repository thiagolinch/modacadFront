import { Link } from "react-router-dom"
// import ReactGA from 'react-ga';

interface buttonInterface {
    title: string
    active: Boolean
    link?: string
    onClick?: () => void; // Permite que `onClick` seja opcional
    // ga_label: string
}
// fonte sera montserrat
export function Button(props: buttonInterface) {
    // ReactGA.event({
    //     category: 'Button',
    //     action: 'Click',
    //     // label: props.ga_label
    //   });

    if(props.active === true){
        return (
            <Link to={`/${props.link}`}>
                <button className="min-h-[60px] w-auto min-w-[210px] p-2 px-[25px]
                    border-[1px] border-[#202020]
                    font-montserrat_medium text-[22px]
                    flex flex-col justify-center items-center
                    bg-gradient-to-t from-[#dcdf1e] to-[#dcdf1e] bg-[length:90%_.90em] bg-no-repeat bg-[position:50%_75%] hover:bg-[#dcdf1e]
                "
                    onClick={props.onClick} // Adicione a propriedade onClick aqui

                >
                    {props.title}
                </button>
            </Link>
        )
    }else{
        return (
            <Link to={`/${props.link}`}>
                <button onClick={props.onClick} className="min-h-[60px] w-auto min-w-[210px] p-2 px-[25px]
                    border-[1px] border-[#202020]
                    font-montserrat_medium text-[22px]
                    flex flex-col justify-center items-center
                    bg-gradient-to-t from-[#dcdf1e] to-[#dcdf1e] bg-[length:90%_.90em] bg-no-repeat bg-[position:calc(90%_-_var(--p,0%))_900%]  hover:bg-[position:50%_75%]
                ">
                    {props.title}
                </button>
            </Link>
        )
    }

}
