import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const renderTemplate = (template, data, accentColor) => {
    switch (template) {
        case 'modern':
            return <ModernTemplate data={data} accentColor={accentColor} />
        case 'minimal':
            return <MinimalTemplate data={data} accentColor={accentColor} />
        case 'minimal-image':
            return <MinimalImageTemplate data={data} accentColor={accentColor} />
        default: 
            return <ClassicTemplate data={data} accentColor={accentColor} />
    }
}



const ResumePreview = ({ data, template, accentColor, classes = '' }) => {
    return (
        <div className='w-full bg-gray-100'>
            <div id='resume-preview' className={"h-screen overflow-auto" + classes}>
                {renderTemplate(template, data, accentColor)}
            </div>
            <style jsx>
                {`
                #resume-preview {
                    margin: 0 auto;
                    max-width: 850px;
                    min-height: 1100px;
                    background: #fff;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
                    border-radius: 8px;
                    padding: 48px 40px;
                    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
                    color: #222;
                }

                @media (max-width: 900px) {
                    #resume-preview {
                        padding: 32px 10px;
                        max-width: 100vw;
                        min-height: 100vh;
                    }
                }

                body {
                    background: #f3f4f6;
                }
                
                `}
            </style>
        </div>
    )
}

export default ResumePreview