import re

files = [
    'experimentCasesData.ts',
    'trickyCasesData.ts',
    'spectrumCasesData.ts',
    'paragraphCasesData.ts',
    'megaEasiestClaimsData.ts',
    'megaTwistersData.ts',
    'megaChatbotParagraphsData.ts',
    'rareCombinationCasesData.ts'
]

for fname in files:
    path = f'../frontend/src/lib/benchmarks/{fname}'
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    matches = re.findall(r"['\"]?id['\"]?\s*:\s*['\"]([^'\"]+)['\"]", text)
    # filter to primary case IDs (exclude sub-claim IDs like c-01-1)
    primary = [m for m in matches if not m.startswith('c-')]
    print(f"{fname}: {len(primary)} cases")
