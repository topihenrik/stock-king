import csv
import operator


with open("companyresult.csv") as f:
    reader = csv.reader(f, delimiter=";")
    rows = [(row[0], int(row[1])) for row in reader]
    sortedlist = sorted(rows, key=operator.itemgetter(1), reverse=True)

with open("tickers_sorted.py", "w") as f:
    tickers_easy = sortedlist[0:333]
    tickers_medium = sortedlist[334:666]
    tickers_hard = sortedlist[667:-1]
    f.write("TICKERS_EASY = [")
    for ticker in tickers_easy:
        f.write(f'"{ticker[0]}",')
    f.write("]")
    f.write("\nTICKERS_MEDIUM = [")
    for ticker in tickers_medium:
        f.write(f'"{ticker[0]}",')
    f.write("]")
    f.write("\nTICKERS_HARD = [")
    for ticker in tickers_hard:
        f.write(f'"{ticker[0]}",')
    f.write("]")
