const swap = (items, leftIndex, rightIndex) => {
    var temp = items[leftIndex]
    items[leftIndex] = items[rightIndex]
    items[rightIndex] = temp
}

const partition = (items, left, right) => {
    var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++
        }
        while (items[j] > pivot) {
            j--
        }
        if (i <= j) {
            swap(items, i, j) //swapping two elements
            i++
            j--
        }
    }
    return i
}

export const quickSort = (items, left, right) => {
    var index
    if (items.length > 1) {
        index = partition(items, left, right) //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1)
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right)
        }
    }
    // console.log('sorted')
    return items;
}