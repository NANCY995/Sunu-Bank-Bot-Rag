import re


def tokenize(text: str) -> set[str]:
    return set(re.findall(r"\w+", text.lower()))


def overlap_ratio(answer: str, contexts: list[str]) -> float:
    answer_tokens = tokenize(answer)
    if not answer_tokens:
        return 0.0
    context_tokens = set()
    for context in contexts:
        context_tokens |= tokenize(context)
    if not context_tokens:
        return 0.0
    return len(answer_tokens & context_tokens) / len(answer_tokens)


def detect_hallucination(
    answer: str,
    contexts: list[str],
    threshold: float = 0.3,
) -> dict:
    ratio = overlap_ratio(answer, contexts)
    return {
        "is_hallucinated": ratio < threshold,
        "overlap_ratio": ratio,
        "threshold": threshold,
    }
