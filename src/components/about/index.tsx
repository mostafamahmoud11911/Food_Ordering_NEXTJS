import { Routes } from '@/constants/enums';
import MainHeading from '../main-heading';
import { gtCurrentLocale } from '@/lib/getCurrentLocaleFromServer';
import { getTrans } from '@/lib/translate';

async function AboutPage() {
    const locale = await gtCurrentLocale();
    const translation = await getTrans(locale);

    return (
        <section className='section-gap' id={Routes.ABOUT}>
            <div className='container text-center'>
                <MainHeading subTitle={translation?.home?.about.aboutUs} title="About Us" />
                <div className='text-accent max-w-md mx-auto mt-4 flex flex-col gap-4'>
                    <p>{translation?.home?.about.descriptions.one}</p>
                    <p>{translation?.home?.about.descriptions.two}</p>
                    <p>{translation?.home?.about.descriptions.three}</p>
                </div>
            </div>
        </section>
    );
}

export default AboutPage;