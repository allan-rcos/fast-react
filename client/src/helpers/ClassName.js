class ClassNameHelper {
    static getColor(color, isButton = false) {
        let classColor
        switch (color) {
            case 'green':
                classColor = 'bg-green-100 border-green-500 text-green-700';
                if (isButton)
                    classColor += ' active:bg-green-200 hover:bg-gray-300'
                break;
            case 'blue':
                classColor = 'bg-blue-100 border-blue-500 text-blue-700';
                if (isButton)
                    classColor += ' active:bg-blue-200 hover:bg-green-300'
                break;
            case 'amber':
                classColor = 'bg-amber-100 border-amber-500 text-amber-700';
                if (isButton)
                    classColor += ' active:bg-amber-200 hover:bg-amber-300'
                break;
            case 'red':
                classColor = 'bg-red-100 border-red-500 text-red-700';
                if (isButton)
                    classColor += ' active:bg-red-200 hover:bg-red-300'
                break;
            case 'purple':
                classColor = 'bg-purple-100 border-purple-500 text-purple-700';
                if (isButton)
                    classColor += ' active:bg-purple-200 hover:bg-purple-300'
                break;
            default:
                classColor = 'bg-gray-100 border-gray-500 text-gray-700';
                if (isButton)
                    classColor += ' active:bg-gray-200 hover:bg-gray-300'
                break;
        }
        return classColor
    }
}

export default ClassNameHelper
