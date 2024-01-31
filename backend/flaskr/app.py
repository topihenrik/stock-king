from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flaskr import utils
import yfinance as yahoo
import random
import os


#TODO: Load tickers from file for easier editing. Defining them here is fine for minimum viable product though.
TICKERS = ["TXG","MMM","ABT","ABBV","ACHC","ACN","AYI","ADM","ADBE","ADP","ADT","AAP","WMS","ACM","AES","AFRM","AFL","AGCO","A","AGL","ADC","AGNC","AIG","AL","APD","ABNB","AKAM","ALK","ALB","ACI","AA","ARE","ALGN","ALLE","ALGM","LNT","ALSN","ALL","ALLY","ALNY","GOOGL","GOOG","AYX","MO","AMZN","AMC","AMCR","AMD","DOX","AMED","AEE","AAL","AEP","AXP","AFG","AMH","AMT","AWK","COLD","AMP","AME","AMG","AMGN","APH","ADI","NLY","ANSS","AM","AR","AON","APA","AIRC","APLS","APO","AAPL","AMAT","APP","ATR","APTV","ARMK","ACGL","AMBP","ARES","ANET","AWI","ARW","AJG","ASH","AZPN","AIZ","AGO","T","TEAM","ATO","ADSK","AN","AZO","AVB","AGR","AVTR","AVY","CAR","AVT","AXTA","AXS","AXON","AZEK","AZTA","BKR","BALL","BAC","OZK","BBWI","BAX","BDX","BSY","WRB","BRK.B","BERY","BBY","BILL","BIO","TECH","BIIB","BMRN","BIRK","BJ","BLK","BX","HRB","SQ","OWL","BK","BA","BOKF","BKNG","BAH","BWA","SAM","BXP","BSX","BYD","BFAM","BHF","BMY","BRX","AVGO","BR","BEPC","BRO","BF.A","BF.B","BRKR","BC","BLDR","BG","BURL","BWXT","CHRW","CABO","CACI","CDNS","CZR","CPT","CPB","COF","CPRI","CAH","CSL","CG","KMX","CCL","CARR","CRI","CASY","CTLT","CAT","CAVA","CBOE","CBRE","CCCS","CDW","CE","CELH","COR","CNC","CNP","CDAY","CERT","CF","CHPT","CRL","SCHW","CHTR","CHE","CC","LNG","CHK","CVX","CMG","CHH","CB","CHD","CHDN","CIEN","CI","CINF","CTAS","CRUS","CSCO","C","CFG","CLVT","CLH","CWEN.A","CWEN","CLF","CLX","NET","CME","CMS","CNA","CNHI","KO","CGNX","CTSH","COHR","COIN","CL","COLB","COLM","CMCSA","CMA","CBSH","ED","CAG","CNXC","CFLT","COP","STZ","CEG","COO","CPRT","CNM","GLW","CTVA","CSGP","COST","CTRA","COTY","CPNG","CUZ","CR","CXT","CACC","CROX","CRWD","CCI","CCK","CSX","CUBE","CMI","CW","CVS","DHI","DHR","DRI","DAR","DDOG","DVA","DECK","DE","DAL","XRAY","DVN","DXCM","FANG","DKS","DLR","DFS","DIS","DOCU","DLB","DG","DLTR","D","DPZ","DCI","DASH","DV","DOV","DOW","DOCS","DKNG","DRVN","DBX","DTM","DTE","DUK","DNB","DD","DXC","DT","EXP","EWBC","EGP","EMN","ETN","EBAY","ECL","EIX","EW","ELAN","ESTC","EA","ESI","ELV","EME","EMR","EHC","ENOV","ENPH","ENTG","ETR","NVST","EOG","EPAM","EPR","EQT","EFX","EQIX","EQH","ELS","EQR","ESAB","WTRG","ESS","EL","ETSY","EEFT","EVR","EG","EVRG","ES","EXAS","EXEL","EXC","EXPE","EXPD","EXR","XOM","FFIV","FDS","FAST","FRT","FDX","FERG","FICO","FNF","FITB","FAF","FCNCA","FHB","FHN","FR","FSLR","FE","FIS","FI","FIVE","FIVN","FLT","FND","FLO","FLS","FMC","FNB","F","FTNT","FTV","FTRE","FBIN","FOXA","FOX","BEN","FCX","FRPT","FYBR","CFR","FCN","GME","GLPI","GPS","GRMN","IT","GTES","GE","GEHC","GEN","GNRC","GD","GIS","GM","G","GNTX","GPC","GILD","DNA","GTLB","GPN","GFS","GLOB","GL","GMED","GDDY","GS","GGG","GWW","LOPE","GPK","GO","GWRE","GXO","HAL","THG","HOG","HIG","HAS","HCP","HE","HAYW","HCA","HR","PEAK","HEI.A","HEI","JKHY","HSY","HTZ","HES","HPE","HXL","DINO","HIW","HLT","HOLX","HD","HON","HRL","HST","HLI","HHH","HWM","HPQ","HUBB","HUBS","HUM","HBAN","HII","HUN","H","IAC","IBM","ICLR","ICUI","IDA","IEX","IDXX","ITW","ILMN","INCY","INFA","IR","INGR","INSP","PODD","IART","INTC","IBKR","ICE","IFF","IP","INTU","ISRG","IVZ","INVH","IONS","IPG","IPGP","IQV","IRDM","IRM","ITT","JBL","J","JHG","JAZZ","JBHT","JEF","JNJ","JCI","JLL","JPM","JNPR","KRTX","KBR","K","KMPR","KVUE","KDP","KEY","KEYS","KRC","KMB","KIM","KMI","KNSL","KEX","KKR","KLAC","KNX","KSS","KHC","KR","KD","LHX","LH","LRCX","LAMR","LW","LSTR","LVS","LSCC","LAZ","LEA","LEG","LDOS","LEN","LEN.B","LII","LBRDA","LBRDK","FWONA","FWONK","LLYVA","LLYVK","LSXMA","LSXMK","LLY","LECO","LNC","LIN","LAD","LFUS","LYV","LKQ","LMT","L","LPX","LOW","LPLA","LCID","LULU","LITE","LYFT","LYB","MTB","M","MSGS","MANH","MAN","CART","MRO","MPC","MRVI","MKL","MKTX","MAR","VAC","MMC","MLM","MRVL","MAS","MASI","MTZ","MA","MTCH","MAT","MKC","MCD","MCK","MDU","MPW","MEDP","MDT","MRK","MRCY","META","MET","MTD","MTG","MGM","MCHP","MU","MSFT","MAA","MIDD","MRTX","MCW","MKSI","MRNA","MHK","MOH","TAP","MDLZ","MDB","MPWR","MNST","MCO","MS","MORN","MOS","MSI","MP","MSA","MSM","MSCI","MUSA","NDAQ","NTRA","NFG","NSA","NCNO","NATL","VYX","NLOP","NTAP","NFLX","NBIX","NFE","NYCB","NYT","NWL","NEU","NEM","NWSA","NWS","NXST","NEE","NKE","NI","NNN","NDSN","JWN","NSC","NTRS","NOC","NCLH","NOV","NVCR","NRG","NU","NUE","NTNX","NVT","NVDA","NVR","ORLY","OXY","OGE","OKTA","OLPX","ODFL","ORI","OLN","OLLI","OHI","OMC","ON","OMF","OKE","ORCL","OGN","OSK","OTIS","OVV","OC","PCAR","PKG","PLTR","PANW","PARAA","PARA","PK","PH","PAYX","PAYC","PYCR","PCTY","PYPL","PEGA","PTON","PENN","PAG","PNR","PEN","PEP","PFGC","PRGO","WOOF","PFE","PCG","PM","PSX","PHIN","PPC","PNFP","PNW","PINS","PXD","PLNT","PLTK","PLUG","PNC","PII","POOL","BPOP","POST","PPG","PPL","PINC","TROW","PRI","PFG","PCOR","PG","PGR","PLD","PB","PRU","PTC","PSA","PEG","PHM","PSTG","PVH","QGEN","QRVO","QCOM","PWR","QS","DGX","QDEL","RCM","RL","RRC","RJF","RYN","RTX","RBC","O","RRX","REG","REGN","RF","RGA","RS","RNR","RGEN","RSG","RMD","RVTY","REXR","REYN","RH","RNG","RBA","RITM","RIVN","RLI","RHI","HOOD","RBLX","RKT","ROK","ROIV","ROKU","ROL","ROP","ROST","RCL","RGLD","RPRX","RPM","RYAN","R","SPGI","SAIA","SAIC","CRM","SLM","SRPT","SBAC","HSIC","SLB","SNDR","SMG","SEB","SEE","SEIC","SRE","ST","S","SCI","NOW","SHW","FOUR","SWAV","SLGN","SPG","SIRI","SITE","SKX","SWKS","SMAR","AOS","SJM","SNA","SNOW","SOFI","SON","SHC","SO","SCCO","LUV","SWN","SPB","SPR","SPLK","SPOT","SSNC","SSRM","STAG","SWK","SBUX","STWD","STT","STLD","SRCL","STE","SF","SYK","SUI","RUN","SYF","SNPS","SNV","SYY","TMUS","TTWO","TNDM","TPR","TRGP","TGT","SNX","FTI","TDOC","TDY","TFX","TPX","THC","TDC","TER","TSLA","TTEK","TXN","TPL","TXRH","TXT","TMO","TFSL","THO","TKR","TJX","TKO","TOST","TOL","BLD","TTC","TPG","TSCO","TTD","TW","TT","TDG","TRU","TNL","TRV","TREX","TRMB","TRIP","TFC","TWLO","TYL","TSN","UHAL","UHAL.B","X","UBER","UI","UDR","UGI","PATH","ULTA","RARE","UAA","UA","UNP","UAL","UPS","URI","UTHR","UWMC","UNH","U","OLED","UHS","UNM","USB","USFD","MTN","VLO","VMI","VVV","VEEV","VTR","VLTO","VRSN","VRSK","VZ","VRTX","VRT","VSTS","VFC","VSAT","VTRS","VICI","VSCO","VIRT","V","VST","VNT","VNO","VOYA","VMC","WPC","WAB","WBA","WMT","WBD","WM","WAT","WSO","W","WBS","WEC","WFC","WELL","WEN","WCC","WST","WAL","WDC","WU","WLK","WRK","WEX","WY","WHR","WTM","WMB","WSM","WTW","WSC","WING","WTFC","KLG","WOLF","WWD","WDAY","WH","WYNN","XEL","XP","XPO","XYL","YETI","YUM","ZBRA","ZG","Z","ZBH","ZION","ZTS","ZM","ZI","ZS"]

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='static')
CORS(app, resources={r'/*' : {'origins': ['*']}})

#---------------------------Mock data gets fetched here on server start until databases are implemented-------------------------------------#
stockData = {}
tickers = yahoo.Tickers('GOOGL AMD AAPL')

for ticker in tickers.tickers.values():
    try:
        stockData.update({ticker.info["symbol"]:ticker.info["marketCap"]})
    except KeyError:
        print("Failed to get market cap information on {}",ticker.ticker["symbol"])
        continue
#-------------------------------------------------------------------------------------------------------------------------------------------#
    
@app.route("/api")
def hello_world():
    return f"<p>{utils.hello_world()}</p>"

@app.route("/api/lorem_ipsum")
def lorem_ipsum():
    return jsonify(utils.lorem_ipsum())

@app.post("/api/test")
def test_function():
    return True

@app.route('/')
def index():
    if os.environ.get('ENV') != None and os.environ.get('ENV') == 'prod':
      return render_template('index.html')
    return ''

# Simple endpoint to receive the market cap of a random company from the server
@app.route('/api/randomCompany')
def getMarketCapFromRandomCompany():
    companyData = random.choice(list(stockData.values()))
    return str(companyData)

#TODO:This needs to be run daily to update stock data into database. Maybe it can be scheduled in fly.io via cron?
#Expensive method. Gets data from Yahoo Finance for all companies defined in TICKERS constant, then makes an update to database. Processes about 5 companies per second, so cannot be used in real-time.
def updateStockDataToDB():
    tickers = yahoo.Tickers(TICKERS)
    for ticker in tickers.tickers.values():
        try:
            # <DATABASE QUERY HERE> 
            #db.query('INSERT INTO TICKERS VALUES ("'+ticker.info["symbol"]+'","'+ticker.info["marketCap"]+'")')
            print()
        except KeyError:
            continue
    return

# This needs to be called before the game can start. We might want to split it into multiple smaller calls to database to make it scalable since asking for all data from database everytime anyone opens the game seems dumb.
def loadStockDataFromDB():
    # <DATABASE QUERY HERE>
    #gameData = db.query('SELECT * FROM TICKERS')
    #sendToFrontend
    return