class DoublyLinkedListNode {
    constructor(value, next = null, prev = null) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    // метод для добавления узла в начало списка
    prepend(value) {
        // создаем новый узел, который будет новым head, при создании передаем параметр, который говорит,
        // что его next будет = текущему head, т.к. новый узел будет стоять перед текущим head
        const newNode = new DoublyLinkedListNode(value, this.head);

        // Если есть head, то сдвигаем его и даем ему ссылку предыдущего узла на новую ноду
        if (this.head) {
            this.head.prev = newNode;
        }

        // Назначаем head на новый узла
        this.head = newNode;

        // Если нет tail, делаем новый узел tail
        if (!this.tail) {
            this.tail = newNode;
        }

        return this;
    }

    // создаем новый узел в конец
    append(value) {
        // Создаем новый узел
        const newNode = new DoublyLinkedListNode(value);

        if (this.tail) {
            // Указываем новый узел в ссылке на следующий узел для текущего последнего узла
            this.tail.next = newNode;
        }

        newNode.prev = this.tail;

        // Переназначаем tail на новый узел
        this.tail = newNode;

        // Если еще нет head, добавляем узел как head
        if (!this.head) {
            this.head = newNode;
        }

        return this;
    }

    // Удаляем любой узел
    delete(value) {
        // Если нет узлов, возвращаем null
        if (!this.head) {
            return null;
        }

        let deletedNode = null;
        let currentNode = this.head;

        // Удаляем все ноды, попадающие под условие
        while (currentNode) {
            if (currentNode.value === value) {

                // Сохраняем значение текущего узла как удаленное
                deletedNode = currentNode;

                // Если необходимо удалить head, то делаем следующий узел новым head
                if (deletedNode === this.head) {
                    this.head = deletedNode.next;

                    // убираем ссылку текущего head на прошлый узел
                    if (this.head) {
                        this.head.prev = null;
                    }

                    return deletedNode;
                }

                // Если необходимо удалить head, то делаем предыдущий узел новым tail
                if (deletedNode === this.tail) {

                    // Если tail должен быть удален, меняем tail на предпоследний узел, который станет новым последним узлом
                    if (deletedNode === this.tail) {
                        this.tail = deletedNode.prev;

                        // Убираем ссылку на следующий узел у нового последнего узла
                        this.tail.next = null;
                        return deletedNode;
                    }
                }
                else {
                    // Если будет удален средний узел, то сохраняем ссылки на следующий и прошлый узлы
                    const prevNode = deletedNode.prev;
                    const nextNode = deletedNode.next;

                    // Меняем ссылки
                    prevNode.next = nextNode;
                    nextNode.prev = prevNode;
                }
            }

            // Переходим на следующий узел
            currentNode = currentNode.next;
        }

        return deletedNode;
    }

    // Поиск узла
    find(value) {
        // Если нет узлов, возвращаем null
        if (!this.head) {
            return null;
        }

        // Устанавливаем текущим узлом первый узел
        let currentNode = this.head;

        // Идем по списку
        while (currentNode) {
            // Сравниваем значение
            if (value !== undefined && currentNode.value === value) {
                return  currentNode;
            }

            currentNode = currentNode.next;
        }
        return  null;
    }

    change(valuePrev, valueNew) {

        const currentNode = this.find(valuePrev);

        currentNode.value = valueNew;

        return currentNode;
    }

    // Вывести весь список
    toArray() {
        // массив для вывода
        const output = [];
        let current = this.head;

        // пролетаем по всем узел
        while (current) {
            output.push(current);
            current = current.next;
        }

        // выводим
        return output;
    }

    // Подсчет строк в списке
    count() {
        return this.toArray().length;
    }
}

console.log('Двусвязный список')
// объявляем новый массив
const list = new DoublyLinkedList();

// обычное добавление в конец
list.append('name');
list.append('is');

// добавление в начало
list.prepend('My');

// Опять добавление в конец
list.append('Slim');
list.append('Shady');


// Удаляем head
list.delete('My')
// Удаляем середину
list.delete('is')
// Удаляем tail
list.delete('Shady')

// Ищем элемент в списке и возвращаем его, если не нашли, возвращаем null
console.log(list.find('name'))

// Изменяем значение узла по значению
console.log(list.change('name', 'God'))

// Вывод всего (оставшегося) списка
console.log(list.toArray());

// Количество оставшихся узлов
console.log(list.count());
