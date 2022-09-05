export default function getRandomColor(noOfColors) {
    var colors = [];
    for (var i = 0; i < noOfColors; i++) {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var x = 0; x < 6; x++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        colors.push(color);
    }
    return colors;
}