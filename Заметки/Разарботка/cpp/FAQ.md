## напиши метод умножения Карацубы в коде c++

Код для метода умножения Карацубы на C++:

```cpp
#include <iostream>
#include <cmath>

using namespace std;

// Функция вычисления количества цифр в числе
int numDigits(int number) {
    if (number == 0) {
        return 1;
    }
    return floor(log10(number)) + 1;
}

// Функция умножения Карацубы
int karatsubaMultiplication(int x, int y) {
    int n = max(numDigits(x), numDigits(y));
    if (n == 1) {
        return x * y;
    }

    int halfN = n / 2;
    int a = x / pow(10, halfN);
    int b = x % (int) pow(10, halfN);
    int c = y / pow(10, halfN);
    int d = y % (int) pow(10, halfN);

    int ac = karatsubaMultiplication(a, c);
    int bd = karatsubaMultiplication(b, d);
    int abcd = karatsubaMultiplication(a+b, c+d);

    return ac * pow(10, 2*halfN) + (abcd - ac - bd) * pow(10, halfN) + bd;
}

int main() {
    int x = 1234;
    int y = 5678;
    cout << "Karatsuba multiplication of " << x << " and " << y << " is: " << karatsubaMultiplication(x, y);
    return 0;
}
```

Пример работы:

```
Karatsuba multiplication of 1234 and 5678 is: 7006652
```