const Feature = ({key,feature}) => {
    return (
        <div key={key} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
            {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
        </div>
    )
}

export default Feature;